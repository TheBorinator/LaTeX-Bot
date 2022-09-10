const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
require('dotenv').config();

const commands = [
	new SlashCommandBuilder()
		.setName('render')
		.setDescription('Render a LaTeX expression.')
		.addStringOption(option => 
			option
				.setName('expression')
				.setDescription('The LaTeX expression you want to render')
				.setRequired(true)
		),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);