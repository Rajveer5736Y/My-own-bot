module.exports = (client) => {

    client.on("messageReactionAdd", async (reaction, user) => {

        try {

            if (reaction.partial) {
                await reaction.fetch();
            }

            if (reaction.message.partial) {
                await reaction.message.fetch();
            }

            if (user.bot) return;

            const data = client.verificationData;

            if (!data) {
                console.log("No verification data loaded");
                return;
            }

            if (reaction.message.id !== data.message_id) return;

            console.log("User:", user.tag);
            console.log("Reaction Emoji Name:", reaction.emoji.name);
            console.log("Reaction Emoji ID:", reaction.emoji.id);
            console.log("Database Emoji Name:", data.emoji_name);
            console.log("Database Emoji ID:", data.emoji_id);

            // Custom emoji check
            if (data.emoji_id) {
                if (reaction.emoji.id !== data.emoji_id) {
                    console.log("Custom emoji ID mismatch");
                    return;
                }
            }
            // Normal emoji check
            else {
                if (reaction.emoji.name !== data.emoji_name) {
                    console.log("Normal emoji mismatch");
                    return;
                }
            }

            const guild = reaction.message.guild;

            const member = await guild.members.fetch(user.id);

            const role = guild.roles.cache.get(data.role_id);

            if (!role) {
                console.log("Role not found");
                return;
            }

            await member.roles.add(role);

            console.log(`Role ${role.name} added to ${user.tag}`);

            try {
                await reaction.users.remove(user.id);
                console.log("Reaction removed");
            } catch (err) {
                console.log("Failed to remove reaction:", err.message);
            }

        } catch (err) {
            console.error("Verification Error:", err);
        }

    });

};
