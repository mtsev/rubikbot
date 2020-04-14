const { server, channels } = require('../config.json');

module.exports = {
    name: 'verifyme',
    description: 'Send direct message to member with verification instructions',
    privileged: false,
    execute: execute,
};

async function execute(guild, message, args) {

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
    `@exec in the #${message.channel.name} channel.`; 

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
        await guild.channels.get(channels.verify).send(botReply).catch(console.error);
    }
}
