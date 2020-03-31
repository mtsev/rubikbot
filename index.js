const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token, server, roles, seed } = require('./config.json');
const { getPad } = require('./random.js');

// Output to console on successful login
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});


// Welcome message for new members
client.on('guildMemberAdd', member => {
    var message = `Welcome to ${server.name}, ${member}! ` +
            `\n\nTo start chatting, please verify yourself by filling out this form: ${server.form}.` +
            "\n\nOnce you've filled out the form, you'll receive an email containing " + 
            "your verification code to your **UNSW email (z1234567@ad.unsw.edu.au)** " +
            "if you are a UNSW student or to the address provided in the form otherwise." +
            "\n\nThe verification code should be in this format: `!verify xxxxxx`" +
            "\nDM this command + code here to verify." +
            "\n\nIf you have any issues or questions, please message an " +
            `@exec in the #verification channel.`; 

    member.send(message);
});

// Bot command for verification
client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'verify') {

        var botReply;

        // Ignore messages outside of DM
        if (message.guild != null) return;

        // Invalid code entered
        if (args.length == 0 || !args[0].match(/[\d]{6}/)) {
            botReply = "Please enter a valid verification code. " +
                    "It should be in this format: `!verify xxxxxx`";
        }

        // Verification successful
        else if (args == getPad(message.author.tag + seed, 6)) {
            botReply = "Congratulations, you have been successfully verified. " +
                    `**Welcome to ${server.name}!** You may now chat in the server.`;
            
            // Add verified role to member
            let guild = client.guilds.get(server.id);
            let role = guild.roles.get(roles.verified);
            let member = guild.members.get(message.author.id);
            member.addRole(role).catch(console.error);
        }

        // Incorrect code entered
        else {
            botReply = "**Sorry, your verification code was incorrect. Please try the following:**\n" +
                    "1. Check that the code was entered correctly and try again.\n" +
                    "2. Check that your Discord tag is the same as what you entered into the form and try again.\n" +
                    `3. Message an @exec in the #verification channel if it's still not working.`;
        }

        // Send message to member
        message.author.send(botReply);
    }
    
});

client.login(token);
