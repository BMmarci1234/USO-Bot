const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jotd')
        .setDescription('Announces the Joke of the Day.')
        .addStringOption(option =>
            option.setName('joke')
                .setDescription('The joke')
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
                .setDescription('The user suggesting the joke')
                .setRequired(true)),
    async execute(interaction) {
        const joke = interaction.options.getString('joke');
        const user = interaction.options.getUser('user');
        const rank = interaction.options.getRole('rank');  // Get selected role
        const date = interaction.options.getString('date');

        const role = interaction.guild.roles.cache.get('1267487629189058571');

        // Admin ellenőrzés
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) &&
            !interaction.member.roles.cache.has('1277191935127326731')) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0xFFFF00)
            .setTitle('**Joke of the Day**')
            .setDescription(`**${date}\n\n${joke}\n**\nIf you'd like to suggest a Joke, DM ${user}\n\nRate the joke in <#1267482252502106194>\n\nSigned,\n${user}\n${rank}`);

        await interaction.reply({ content: `${role}`, embeds: [embed] });
    },
};
