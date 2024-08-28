const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('christmascount')
        .setDescription('Displays the number of days until Christmas.')
        .addIntegerOption(option =>
            option.setName('days')
                .setDescription('Number of days until Christmas')
                .setRequired(true)),
    async execute(interaction) {
        const days = interaction.options.getInteger('days');
        const role = interaction.guild.roles.cache.get('1268601941496172614');

        // Admin ellenőrzés
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) &&
            !interaction.member.roles.cache.has('1277191935127326731')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('**:christmas_tree: | Days until Christmas!!!**')
            .setDescription(`**:evergreen_tree: | There are ||${days}|| days until Christmas!\n**\n:santa_tone1: | What are you getting for Christmas? Say in <#1236312784610918480>`);

        await interaction.reply({ content: `${role}`, embeds: [embed] });
    },
};
