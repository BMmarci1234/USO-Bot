const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dm')
        .setDescription('Send a private message to a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to send the message to')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to send')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const message = interaction.options.getString('message');

        const embed = new EmbedBuilder()
            .setColor(0x000000)
            .setDescription(message);

        try {
            await user.send({ embeds: [embed] });
            await interaction.reply({ content: 'DM sent successfully!', ephemeral: true });
        } catch (error) {
            console.error(`Could not send DM to ${user.tag}: `, error);
            await interaction.reply({ content: 'Failed to send DM. The user might have DMs disabled.', ephemeral: true });
        }
    },
};
