require('dotenv').config();
const fs = require('node:fs');
const { token } = require('./settings');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const db = require('./database/database.js');

db.query('SELECT * FROM users;', [])
	.then(res => {
		console.log(res.rows);
	})
	.catch(e => console.error(e.stack));

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

const tasksPath = path.join(__dirname, 'scheduled-tasks');
const taskFiles = fs.readdirSync(tasksPath).filter(file => file.endsWith('.js'));

for (const file of taskFiles) {
	const filePath = path.join(tasksPath, file);
	require(filePath)(client);
}

// Login to Discord with your client's token
client.login(token);
