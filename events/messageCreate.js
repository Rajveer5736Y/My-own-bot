const config = require("../config");

module.exports = (client) => {

    client.on("messageCreate", async message => {

        if (message.author.bot) return;
        if (!message.content.startsWith(config.prefix)) return;

        const args = message.content
            .slice(config.prefix.length)
            .trim()
            .split(/ +/);

        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName);

        if (!command) return;

        try {
            await command.execute(message, args, client);
        } catch (error) {
            console.error(error);
        }

    });

};
