const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('termination')
        .setDescription('Issues a termination notice to a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to terminate')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for termination')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        // Check if the command user has the required permissions (Admin or a specific role)
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) &&
            !interaction.member.roles.cache.has('1277191935127326731')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        // Create the embed to send to the user
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Termination Notice')
            .setDescription(`Hello,\n\nIt is with deep regret that the USO Punishment Team have decided to terminate you from USO as a trainer.\n\nThe reason you are being terminated is for:\n\n${reason}\n\nAny questions, DM a member of the punishment team.`);

        try {
            // Send the termination notice to the user via DM
            await user.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error sending DM:', error);
            return interaction.reply({ content: 'Unable to send DM to the user.', ephemeral: true });
        }

        // Reply to the command user
        await interaction.reply({ content: `Termination notice issued to ${user.tag} for the reason: ${reason}.`, ephemeral: true });
    },
};
