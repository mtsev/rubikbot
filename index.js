const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token, server, channels, roles, seed } = require('./config.json');
const { getPad } = require('./random.js');

// Output to console on successful login
client.on('ready', () => {
    let d = new Date();
    console.log(`[${d.toLocaleString()}] Logged in as ${client.user.tag}!`);
});

// Bot commands
client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    // Send welcome message to member if they missed it the first time
    if (command === 'verifyme') {

        // Ignore messages outside of verification channel
        if (message.channel.id !== channels.verify) return;

        // Construct welcome message
        const welcome = `Welcome to ${server.name}, ${message.author}! ` +
        `\n\nTo start chatting, please verify yourself by filling out this form: ${server.form}.` +
        "\n\nOnce you've filled out the form, you'll receive an email containing " + 
        "your verification code to your **UNSW email (z1234567@ad.unsw.edu.au)** " +
        "if you are a UNSW student or to the address provided in the form otherwise." +
        "\n\nThe verification code should be in this format: `!verify xxxxxx`" +
        "\nDM this command + code here to verify." +
        "\n\nIf you have any issues or questions, please message an " +
        `@exec in the #verification channel.`; 

        // Send direct message to member
        try {
            await message.author.send(welcome);
        } catch(error) {

            let botReply;
            let d = new Date();

            // Cannot direct message member
            if (error.code === 50007) {
                botReply = `${message.author}, I couldn't send you a message. Please go to 'Privacy Settings' ` +
                    "for this server and allow direct messages from server members.";
                console.error(`[${d.toLocaleString()}] Couldn't DM user ${message.author.tag}`);
            }

            // Some other error has occurred
            else {
                botReply = `${message.author}, sorry, an error has occurred. ` +
                    "Please try again or ping an @exec if the problem doesn't go away.";
                console.error(`[${d.toLocaleString()}]`, error);
            }

            // Send error message into verification channel
            await client.channels.get(channels.verify).send(botReply);
        }
    }

    // Check verification code and update roles
    else if (command === 'verify') {

        // Ignore messages outside of DM
        if (message.channel.type === 'text') return;

        // Log command
        let d = new Date();
        console.log(`[${d.toLocaleString()}] ${message.author.tag} entered '${args}' (${code})`);

        let botReply;
        const guild = client.guilds.get(server.id);
        const member = guild.members.get(message.author.id);
        const code = getPad(message.author.tag.toLowerCase() + seed, 6);

        // Invalid code entered
        if (args.length === 0 || !args[0].match(/[\d]{6}/)) {
            botReply = "Please enter a valid verification code. " +
                    "It should be in this format: `!verify xxxxxx`";
        }

        // Member is already verified
        else if (member.roles.has(roles.verified)) {
            botReply = "You have already been verified. If you can't talk in the server, please message an exec.";
        }

        // Verification successful
        else if (args[0] === code) {

            // Add verified role to member
            await member.addRole(roles.verified).catch(console.error);

            botReply = "Congratulations, you have been successfully verified. " +
                    `**Welcome to ${server.name}!** You may now chat in the server.`;
        }

        // Incorrect code entered
        else {
            botReply = "**Sorry, your verification code was incorrect. Please try the following:**\n" +
                    "1. Check that the code was entered correctly and try again.\n" +
                    "2. Check that your Discord tag is the same as what you entered into the form and try again.\n" +
                    `3. Message an @exec in the #verification channel if it's still not working.`;
        }

        // Send message to member, shouldn't throw an error because we're replying to a DM
        await message.author.send(botReply).catch(console.error);
    }  
});

// Log into Discord
client.login(token);
