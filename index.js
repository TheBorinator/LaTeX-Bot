const { Client, GatewayIntentBits } = require('discord.js');
const { unlink } = require('node:fs');
const katex = require('katex');
const nodeHtmlToImage = require('node-html-to-image');
require('dotenv').config();

const header = `<!DOCTYPE html><html><head>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.2/dist/katex.min.css">
<style>body { color: #ffffff; width: fit-content; height: fit-content; } .katex { font-size: 7.5em; }</style>
</head><body>`;
const footer = `</body></html>`;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'render') {
		const expression = interaction.options.getString('expression');
		const ephemeral = interaction.options.getBoolean('hidden') ?? false;

		await interaction.deferReply({ ephemeral });

		try {
			const body = katex.renderToString(expression, {
				throwOnError: false,
				displayMode: true
			});
		
			let outputPath = `./images/${interaction.id}.png`;

			await nodeHtmlToImage({
				html: header + body + footer,
				transparent: true,
				output: outputPath
			});

			await interaction.followUp({ files: [ { attachment: outputPath, name: outputPath } ], ephemeral });
			unlink(outputPath, (e) => {});
		}
		catch(e) {
			console.log(process.env.NODE_ENV === 'development' ? e : null);
			interaction.followUp({ content: 'Invalid LaTeX string.', ephemeral });
		}
	}
});

client.login(process.env.BOT_TOKEN);