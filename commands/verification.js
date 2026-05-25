const pool = require("../database");
const {
    PermissionsBitField
} = require("discord.js");

module.exports = {
    name: "verification",

    async execute(message, args) {

        if (
            !message.member.permissions.has(
                PermissionsBitField.Flags.Administrator
            )
        ) {
            return message.reply(
                "❌ Administrator permission required."
            );
        }

        const subcommand =
            args[0]?.toLowerCase();

        if (!subcommand) {
            return message.reply(
                "Usage: !verification setup #channel @role emoji"
            );
        }

        // ---------------- STATUS ----------------

        if (subcommand === "status") {

            const result =
                await pool.query(
                    "SELECT * FROM verification WHERE guild_id = $1",
                    [message.guild.id]
                );

            if (!result.rows.length) {
                return message.reply(
                    "❌ Verification is not configured."
                );
            }

            const data = result.rows[0];

            return message.reply(
                `✅ Verification Status

Channel: <#${data.channel_id}>
Role: <@&${data.role_id}>
Message ID: ${data.message_id}
Emoji: ${data.emoji_name}`
            );
        }

        // ---------------- DISABLE ----------------

        if (subcommand === "disable") {

            await pool.query(
                "DELETE FROM verification WHERE guild_id = $1",
                [message.guild.id]
            );

            return message.reply(
                "✅ Verification disabled."
            );
        }

        // ---------------- SETUP ----------------

        if (subcommand === "setup") {

            const channel =
                message.mentions.channels.first();

            const role =
                message.mentions.roles.first();

            const emoji = args[3];

            if (!channel || !role || !emoji) {
                return message.reply(
                    "Usage: !verification setup #channel @role emoji"
                );
            }

            const verifyMessage =
                await channel.send({
                    content:
                        " React below to verify and gain access."
                });

            await verifyMessage.react(emoji);

            const emojiId =
                emoji.match(/\d+/)?.[0] || null;

            await pool.query(
                `
                INSERT INTO verification
                (
                    guild_id,
                    channel_id,
                    role_id,
                    message_id,
                    emoji_id,
                    emoji_name
                )
                VALUES
                ($1,$2,$3,$4,$5,$6)
                ON CONFLICT (guild_id)
                DO UPDATE SET
                    channel_id = EXCLUDED.channel_id,
                    role_id = EXCLUDED.role_id,
                    message_id = EXCLUDED.message_id,
                    emoji_id = EXCLUDED.emoji_id,
                    emoji_name = EXCLUDED.emoji_name
                `,
                [
                    message.guild.id,
                    channel.id,
                    role.id,
                    verifyMessage.id,
                    emojiId,
                    emoji
                ]
            );

            return message.reply(
                "✅ Verification configured."
            );
        }
    }
};
