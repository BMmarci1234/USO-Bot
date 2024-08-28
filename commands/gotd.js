const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gotd')
        .setDescription('Announces the Game of the Day.')
        .addStringOption(option =>
            option.setName('game')
                .setDescription('The game title')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('rank')
                .setDescription('Role rank')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('date')
                .setDescription('The date of the announcement')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user suggesting the game')
                .setRequired(true)),
    async execute(interaction) {
        const game = interaction.options.getString('game');
        const user = interaction.options.getUser('user');
        const rank = interaction.options.getRole('rank');  // Get selected role
        const date = interaction.options.getString('date');

        const role = interaction.guild.roles.cache.get('1267487992944132256');

        // Admin ellenőrzés
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) &&
            !interaction.member.roles.cache.has('1277191935127326731')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0x800080)
            .setTitle('**ame of the Day**')
            .setDescription(`**${date}\n\n${game}\n**\nIf you'd like to suggest a Game, DM ${user}\n\nRate the game in <#1267483296548257882>\n\nSigned,\n${user}\n${rank}`);

        await interaction.reply({ content: `${role}`, embeds: [embed] });
    },
};
