const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, server } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

/* Read all command files in commands directory */
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

/* Initialisation sequence */
var guild;
client.on('ready', () => {
    // Log init to console
    let d = new Date();
    console.log(`[${d.toLocaleString()}] Logged in as ${client.user.tag}!`);

    // Get guild
    guild = client.guilds.get(server.id);
});

/* Bot commands */
client.on('message', async message => {

    // Ignore non-commands and messages from bots
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // Parse message
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

    // Ignore invalid command
    if (!command) return;
    
    // Execute command
    try {
        await command.execute(guild, message, args);
    } catch (error) {

        // Log the error to console
        let d = new Date();
        console.error(`[${d.toLocaleString()}]`, error);

        // Reply to message with error message
        await message.reply("Sorry, an error has occurred. " +
            "Please try again or ping an @exec if the problem doesn't go away.");
    }

});

// Log into Discord
client.login(token);
