const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('qotd')
        .setDescription('Announces the Question of the Day.')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('The question')
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
                .setDescription('The user suggesting the question')
                .setRequired(true)),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const user = interaction.options.getUser('user');
        const rank = interaction.options.getRole('rank');  // Get selected role
        const date = interaction.options.getString('date');

        const role = interaction.guild.roles.cache.get('1277191935127326731');

        // Admin ellenőrzés
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) &&
            !interaction.member.roles.cache.has('1277191935127326731')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0xFFFF00)
            .setTitle('**:grey_question: | QOTD | **' + date)
            .setDescription(`**${question}\n**\n:index_pointing_at_the_viewer: | If you ever want to suggest a Question Of The Day, DM ${user}\n\nSigned,\n${user}\n${rank}`);

        await interaction.reply({ content: `${role}`, embeds: [embed] });
    },
};
