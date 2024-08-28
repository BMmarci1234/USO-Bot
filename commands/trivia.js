const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trivia')
        .setDescription('Announces the Trivia of the Day.')
        .addStringOption(option =>
            option.setName('trivia')
                .setDescription('The trivia')
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
                .setDescription('The user suggesting the trivia')
                .setRequired(true)),
    async execute(interaction) {
        const trivia = interaction.options.getString('trivia');
        const user = interaction.options.getUser('user');
        const rank = interaction.options.getRole('rank');  // Get selected role
        const date = interaction.options.getString('date');

        // Ellenőrizzük, hogy a felhasználónak van-e jogosultsága a parancs használatára
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) &&
            !interaction.member.roles.cache.has('1277191935127326731')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('**Trivia of the Day**')
            .setDescription(`**${date}\n\n${trivia}\n**\nIf you'd like to suggest a Trivia, DM ${user}\n\nRate the trivia in <#1242385274131185688>\n\nSigned,\n${user}\n${rank}`);

        await interaction.reply({ content: `<@&1242387238139068507>`, embeds: [embed] });
    },
};
