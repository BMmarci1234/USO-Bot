const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pass')
        .setDescription('Sends a pass result to a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to send the pass result to')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('reader')
                .setDescription('The reader who reviewed the result')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('notes')
                .setDescription('Additional notes for the pass result')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reader = interaction.options.getUser('reader');
        const notes = interaction.options.getString('notes');

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('USO Results')
            .setDescription(`Username: ${user}\nReader: ${reader}\nResult: Passed!!!!\nNotes: ${notes}\n\n**Please read!** __You will now be given the Awaiting phase 2 role, please wait for phase 2 training!__`);

        await interaction.reply({ content: `${user}`, embeds: [embed] });
    },
};
