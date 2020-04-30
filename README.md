# RubikBot
Verification bot for UNSW Rubik Society's Discord server based on [lo-fi society's bot, seba](https://github.com/mtsev/seba).

* Sends DM with verification instructions when prompted with `!verifyme`
* Verifies members using a code emailed by [this google script](https://github.com/mtsev/seba-form-script) and updates their roles

**Note that this bot does not send emails.** This [google script](https://github.com/mtsev/seba-form-script) added to your verification form will send emails. RubikBot verifies using codes sent out by this script.

## Installation
Download the source code from the [latest release](https://github.com/mtsev/rubikbot/releases/latest).

You can run this bot in [Docker](https://docs.docker.com/get-docker/) on a Linux server with the `start` script.
```sh
$ ./start
```

Alternatively, you can manually install dependencies and run it. This bot requires Node.js to run.
```sh
$ npm install
$ npm start
```

## Configuration
Copy `config-sample.json` to `config.json` and set the following values:

* `prefix` is the string proceeding a bot command
* `token` is the Discord bot token. Get this from the [Discord Developer Portal](https://discordapp.com/developers/applications/)
* `server` has info regarding your server as follows:
    - `id` is the ID of your Discord server
    - `name` is the name of your society or Discord server
    - `form` is a link to your verification form
* `channels` has the IDs of channels in your server:
    - `verify` is the ID of the channel for members to call `!verifyme` in
* `roles` has the IDs of user roles in your server:
    - `verified` is the ID of the role to assign to members once they verify
    - `exec` is the ID of the exec or admin role to use privileged bot commands
* `seed` is a secret value used to generate the verification code. **Must be the same as the google script seed value**
