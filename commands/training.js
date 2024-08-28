const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('training')
        .setDescription('Announces a training session.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages)  // Only users with specific role can use this command
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user who is hosting the training')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');

        // Check if the user has the required role
        if (!interaction.member.roles.cache.has('1247639650009354314')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('😃 | Training')
            .setDescription(`👩‍🏫 | A UK Special Operations training is being hosted, if you’d like to get a lovely promotion, come and attend!\n\n👋🏻 | Training hosted by ${user.tag}`);

        await interaction.reply({ content: `<@&1236380647988400269>`, embeds: [embed] });
    },
};
