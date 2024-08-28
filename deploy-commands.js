const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('fs');
const path = require('path');

// Feltételezve, hogy a getFiles függvény valahol definiálva van.
const getFiles = (dir, suffix = '.js') => {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let jsFiles = [];
  for (const file of files) {
    if (file.isDirectory()) {
      jsFiles = [...jsFiles, ...getFiles(`${dir}/${file.name}`, suffix)];
    } else if (file.name.endsWith(suffix)) {
      jsFiles.push(path.join(dir, file.name));
    }
  }
  return jsFiles;
};

let commands = [];
const commandFiles = getFiles('./commands');

for (const file of commandFiles) {
  // Biztosítja, hogy a `require` relatív útvonalat kapjon.
  const command = require(path.resolve(file));
  if (command.data) {
    commands.push(command.data); // Közvetlenül hozzáadjuk az adatot
  }
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    // Használj guild-scoped deploy-t fejlesztési célokra
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();
