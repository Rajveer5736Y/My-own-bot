const {
    PermissionsBitField,
    ChannelType
} = require("discord.js");

module.exports = {
    name: "verification",

    async execute(message, args, client) {

        if (
            !message.member.permissions.has(
                PermissionsBitField.Flags.Administrator
            )
        ) {
            return message.reply(
                "❌ You must be an administrator."
            );
        }

        const channel =
            message.mentions.channels.first();

        const role =
            message.mentions.roles.first();

        if (!channel || !role) {
            return message.reply(
                "Usage: !verification #channel @role"
            );
        }

        const everyone =
            message.guild.roles.everyone;

        // Hide all channels except verification channel
        for (const [, guildChannel] of message.guild.channels.cache) {

            if (guildChannel.id === channel.id)
                continue;

            try {

                await guildChannel.permissionOverwrites.edit(
                    everyone,
                    {
                        ViewChannel: false
                    }
                );

                await guildChannel.permissionOverwrites.edit(
                    role,
                    {
                        ViewChannel: true
                    }
                );

            } catch (err) {
                console.error(err);
            }
        }

        await channel.permissionOverwrites.edit(
            everyone,
            {
                ViewChannel: true,
                SendMessages: false
            }
        );

        const verifyMsg =
            await channel.send({
                content:
                    "✅ **React below to verify and gain access to the server.**"
            });

        await verifyMsg.react("✅");

        client.verificationData = {
            guildId: message.guild.id,
            messageId: verifyMsg.id,
            roleId: role.id
        };

        message.reply(
            "✅ Verification system created."
        );
    }
};
