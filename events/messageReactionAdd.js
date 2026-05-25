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

            if (
                reaction.emoji.name !== "✅"
            ) return;

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
