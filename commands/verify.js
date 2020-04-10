const { server, roles, seed } = require('../config.json');
const { getPad } = require('../random.js');

module.exports = {
    name: 'verify',
    description: 'Checks if a given verification code is correct and updates user role',
    privileged: false,
    execute: execute,
};

async function execute(guild, message, args) {

    // Ignore messages outside of DM
    if (message.channel.type === 'text') return;

    let botReply;
    const member = guild.member(message.author);
    const code = getPad(message.author.tag.toLowerCase() + seed, 6);

    // Log command
    let d = new Date();
    console.log(`[${d.toLocaleString()}] ${message.author.tag} entered '${args}' (${code})`);

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

