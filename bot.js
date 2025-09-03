const { Collection } = require("discord.js");
const fs = require("fs");

function setupCommands(client, prefix) {
  // Create command collection
  client.commands = new Collection();

  // Read all .js files inside commands/
  const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
  }

  // Listen for messages
  client.on("messageCreate", (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
      command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply("⚠️ There was an error executing that command!");
    }
  });
}

module.exports = { setupCommands };
