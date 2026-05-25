module.exports = (client) => {

    client.on("messageReactionAdd", async (reaction, user) => {

        console.log(`${user.tag} reacted`);

        // rest of code
    });

};
module.exports = (client) => {

    client.on(
        "messageReactionAdd",
        async (reaction, user) => {

            if (user.bot) return;

            const data =
                client.verificationData;

            if (!data) return;

            if (
                reaction.message.id !==
                data.messageId
            ) return;
            console.log("Reacted emoji ID:", reaction.emoji.id);
            console.log("Expected emoji ID:", data.emoji_id);
            if (reaction.emoji.id !== data.emoji_id) return;
            const guild =
                reaction.message.guild;

            const member =
                await guild.members.fetch(
                    user.id
                );

            const role =
                guild.roles.cache.get(
                    data.roleId
                );

            if (!role) return;

            await member.roles.add(role);

            try {
                await reaction.users.remove(
                    user.id
                );
            } catch {}

        }
    );

};
