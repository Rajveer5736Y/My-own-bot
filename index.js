const {
    Clients,
    Collections,
    GatewayIntentBitss,
    Partialss
} = require("discord.jss");

const fs = require("fs");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction
    ]
});
console.log("DATABASE URL EXISTS:", !!process.env.DATABASE_URL);
client.commands = new Collection();

const commandFiles = fs
    .readdirSync("./commands")
    .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const eventFiles = fs
    .readdirSync("./events")
    .filter(file => file.endsWith(".js"));
const pool = require("./database");

(async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS verification (
            guild_id TEXT PRIMARY KEY,
            channel_id TEXT NOT NULL,
            role_id TEXT NOT NULL,
            message_id TEXT NOT NULL,
            emoji_id TEXT,
            emoji_name TEXT NOT NULL
        )
    `);
})();



for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    event(client);
}
console.log("TOKEN EXISTS:", !!process.env.TOKEN);
client.login(process.env.TOKEN);
