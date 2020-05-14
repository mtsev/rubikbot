const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, server } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

/* console.log with datetime prepended */
var log = console.log;
console.log = function () {
    var first_parameter = arguments[0];
    var other_parameters = Array.prototype.slice.call(arguments, 1);
    var formatted = first_parameter ? `[${new Date().toLocaleString()}] ` + first_parameter : '';
    log.apply(console, [formatted].concat(other_parameters));
};

/* console.error with datetime prepended */
var err = console.error;
console.error = function () {
    var first_parameter = arguments[0];
    var other_parameters = Array.prototype.slice.call(arguments, 1);
    var formatted = first_parameter ? `[${new Date().toLocaleString()}] ` + first_parameter : '';
    err.apply(console, [formatted].concat(other_parameters));
};

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
    console.log(`Logged in as ${client.user.tag}!`);

    // Get guild
    guild = client.guilds.get(server.id);

    // Set status message
    client.user.setActivity(`${prefix}verifyme`, { type: 'LISTENING' });
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

    // Log all command uses
    let channel = (message.channel.type === 'text') ? message.channel.name : 'DM';
    console.log(`<${message.author.tag}> ${message.content} (${channel})`);
    
    // Execute command
    try {
        await command.execute(guild, message, args);
    } catch (error) {

        // Log the error to console
        console.error(commandName + ':', error);

        // Reply to message with error message
        await message.reply("Sorry, an error has occurred. " +
            "Please try again or ping an @exec if the problem doesn't go away.");
    }

});

/* Log into Discord */
client.login(token);

/* Graceful shutdown */
const sigs = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
sigs.forEach(sig => {
    process.on(sig, async () => {
        console.log(`${sig} signal received`);
        console.log(`Logging out ${client.user.tag}...`);
        await client.destroy();
        console.log('Goodbye!\n');
        process.exit();
    });
});
