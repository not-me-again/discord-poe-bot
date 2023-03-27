require("dotenv").config();

const { REST, Routes } = require('discord.js');
const CONFIG = require('./config.json');

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN || CONFIG.BOT_TOKEN);

// and deploy your commands!
module.exports = async (commands, clientId, guildId) => {
	try {
		console.log(`[Discord:REST] Started refreshing ${commands.length} commands`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(clientId/*, guildId*/),
			{ body: commands },
		);

		console.log(`[Discord:REST] Successfully reloaded ${data.length} commands`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
}