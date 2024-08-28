const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('potd')
        .setDescription('Announces the Plane of the Day.')
        .addStringOption(option =>
            option.setName('plane')
                .setDescription('The plane name')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('company')
                .setDescription('The manufacturer or airline')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('fact')
                .setDescription('A fact about the plane')
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('image')
                .setDescription('An image of the plane')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('rank')
                .setDescription('Role rank')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('date')
                .setDescription('The date of the announcement')
                .setRequired(true)),
    async execute(interaction) {
        const plane = interaction.options.getString('plane');
        const company = interaction.options.getString('company');
        const fact = interaction.options.getString('fact');
        const image = interaction.options.getAttachment('image');
        const date = interaction.options.getString('date');
        const rank = interaction.options.getRole('rank');  // Get selected role

        const role = interaction.guild.roles.cache.get('1267487731844644874');

        // Admin ellenőrzés
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) &&
            !interaction.member.roles.cache.has('1277191935127326731')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0xFFFF00)
            .setTitle('Plane of the Day')
            .setDescription(`${date}\n\n${plane} by ${company}\n\nFact: ${fact}`)
            .setImage(image.url);

        await interaction.reply({ content: `${role}`, embeds: [embed] });
    },
};
