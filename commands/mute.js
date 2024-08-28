const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../utils/database.js'); // Import database

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Temporarily mutes a user.')
        .addUserOption(option => option.setName('user').setDescription('The user to mute.').setRequired(true))
        .addStringOption(option => option.setName('length').setDescription('Duration of the mute (e.g. 10s, 5m, 2h, 1d).').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const lengthInput = interaction.options.getString('length').toLowerCase();
        const member = interaction.guild.members.cache.get(target.id);

        if (!member) {
            return interaction.reply({ content: 'User not found on the server.', ephemeral: true });
        }

        // Convert time to milliseconds
        let ms;
        const length = parseInt(lengthInput.slice(0, -1), 10);
        const unit = lengthInput.slice(-1);

        switch (unit) {
            case 's': // Seconds
                ms = length * 1000;
                break;
            case 'm': // Minutes
                ms = length * 60 * 1000;
                break;
            case 'h': // Hours
                ms = length * 60 * 60 * 1000;
                break;
            case 'd': // Days
                ms = length * 24 * 60 * 60 * 1000;
                break;
            default:
                return interaction.reply({ content: 'Invalid duration format. Use s, m, h, or d units.', ephemeral: true });
        }

        try {
            await member.timeout(ms, 'Mute by bot');

            // Insert mute record into the database
            db.run(`INSERT INTO punishments (user_id, guild_id, type, reason) VALUES (?, ?, ?, ?)`, 
                [target.id, interaction.guild.id, 'mute', `Mute for ${lengthInput}`], 
                (err) => {
                    if (err) {
                        console.error('Error inserting mute into database:', err);
                    }
                }
            );

            const embed = new EmbedBuilder()
                .setTitle('User Muted')
                .setDescription(`${target.tag} has been muted for ${lengthInput}.`)
                .addFields({ name: 'Duration', value: lengthInput })
                .setColor('#00FF00'); // Green

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error muting the user.', ephemeral: true });
        }
    },
};
