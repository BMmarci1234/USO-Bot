const { Client, GatewayIntentBits, Collection, EmbedBuilder, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

// Bot client létrehozása
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Parancsok betöltése
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set parancs név és modul
    client.commands.set(command.data.name, command);
}

// Parancsok kezelése
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

// Ping check és mute funkció
const pingCounts = new Map();

client.on(Events.MessageCreate, async (message) => {
    // Ne reagáljon, ha a bot küldi az üzenetet
    if (message.author.bot) return;

    // Ha a pingelt szerep megegyezik a HICOM role id-vel
    if (message.mentions.roles.has('1258030023776931860')) {
        const userId = message.author.id;

        // Ne reagáljon, ha van egy kivételes szerepe
        if (message.member.roles.cache.has('1260905625383342123')) {
            return;
        }

        // Növeljük a ping számát
        const count = pingCounts.get(userId) || 0;
        pingCounts.set(userId, count + 1);

        if (count + 1 === 3) {
            // Némítás 5 percre
            const muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');
            if (muteRole) {
                await message.member.roles.add(muteRole);
                setTimeout(() => message.member.roles.remove(muteRole), 5 * 60 * 1000); // 5 perces némítás
            }
            pingCounts.set(userId, 0); // Számláló visszaállítása
        } else {
            // Figyelmeztető üzenet
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle(':uso: | USO team.')
                .setDescription(
                    `🔴 | Please do not ping any member of the HICOM team, they are very busy.\n\n💨 | We will get back to you ASAP. Please be patient.\n\nThank you for your patience.`
                )
                .setFooter({ text: 'USO Team', iconURL: 'https://cdn.discordapp.com/emojis/1260374936845942784.png' });

            return message.channel.send({ embeds: [embed] });
        }
    }
});

// Bot bejelentkezése
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Bot token bejelentkezése a config.json-ból
client.login(config.token);
