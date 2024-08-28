const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fotd')
        .setDescription('Announces the Film of the Day.')
        .addStringOption(option =>
            option.setName('film')
                .setDescription('The film title')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('creator')
                .setDescription('The creator of the film')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('watching')
                .setDescription('Where to watch the film')
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
                .setDescription('The user suggesting the film')
                .setRequired(true)),
    async execute(interaction) {
        const film = interaction.options.getString('film');
        const user = interaction.options.getUser('user');
        const creator = interaction.options.getString('creator');
        const watching = interaction.options.getString('watching');
        const rank = interaction.options.getRole('rank');  // Get selected role
        const date = interaction.options.getString('date');

        const role = interaction.guild.roles.cache.get('1267487731844644874');

        // Admin ellenőrzés
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) &&
            !interaction.member.roles.cache.has('1277191935127326731')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0xFFFF00)
            .setTitle('F**ilm of the Day**')
            .setDescription(`**${date}\n\n${film}\n**\nIf you'd like to suggest a Film, DM ${user}\n\nCreator: ${creator}\n\nWhere to watch: ${watching}\n\nRate the film in <#1267482513001943182>\n\nSigned,\n${user}\n${rank}`);

        await interaction.reply({ content: `${role}`, embeds: [embed] });
    },
};
