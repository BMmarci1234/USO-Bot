const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../utils/database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('unmutes user.')
        .addUserOption(option => option.setName('user').setDescription('the user you want to unmute.').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(target.id);

        if (!member) {
            return interaction.reply({ content: 'Cannot find this user.', ephemeral: true });
        }

        try {
            await member.timeout(null, 'Succesfully unmuted user');

            // Távolítsuk el a némítást az adatbázisból
            db.run(`DELETE FROM punishments WHERE user_id = ? AND guild_id = ? AND type = ?`, 
                [target.id, interaction.guild.id, 'mute']);

            const embed = new EmbedBuilder()
                .setTitle('Unmuted user!')
                .setDescription(`${target.tag} have been unmuted.`)
                .setColor('#00FF00'); // Zöld

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Something went wrong.', ephemeral: true });
        }
    },
};
