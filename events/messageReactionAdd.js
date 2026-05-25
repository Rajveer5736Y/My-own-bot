const pool = require("../database");

module.exports = (client) => {

    client.on(
        "messageReactionAdd",
        async (reaction, user) => {

            try {

                if (user.bot) return;

                if (reaction.partial)
                    await reaction.fetch();

                const guild =
                    reaction.message.guild;

                if (!guild) return;

                const result =
                    await pool.query(
                        "SELECT * FROM verification WHERE guild_id = $1",
                        [guild.id]
                    );

                if (!result.rows.length) {
                    console.log("No verification data found");
                    return;
                }

                const data =
                    result.rows[0];

                if (
                    reaction.message.id !==
                    data.message_id
                ) return;

                if (data.emoji_id) {

                    if (
                        reaction.emoji.id !==
                        data.emoji_id
                    ) return;

                } else {

                    if (
                        reaction.emoji.name !==
                        data.emoji_name
                    ) return;
                }

                const member =
                    await guild.members.fetch(
                        user.id
                    );

                const role =
                    guild.roles.cache.get(
                        data.role_id
                    );

                if (!role) {
                    console.log("Role not found");
                    return;
                }

                await member.roles.add(role);

                console.log(
                    `Verified ${user.tag}`
                );

                try {
                    await reaction.users.remove(
                        user.id
                    );
                } catch (err) {
                    console.log(
                        "Couldn't remove reaction:",
                        err.message
                    );
                }

            } catch (err) {

                console.error(
                    "Verification Error:",
                    err
                );
            }
        }
    );
};
