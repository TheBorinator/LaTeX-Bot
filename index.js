const { Client, GatewayIntentBits } = require('discord.js');
const { unlink } = require('node:fs');
const katex = require('katex');
const nodeHtmlToImage = require('node-html-to-image');
require('dotenv').config();

const header = `<!DOCTYPE html><html><head>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.2/dist/katex.min.css" integrity="sha384-bYdxxUwYipFNohQlHt0bjN/LCpueqWz13HufFEV1SUatKs1cm4L6fFgCi1jT643X" crossorigin="anonymous">
<style>body { background-color: #36393f; color: #ffffff; min-width: 1000px; height: 200px; } .katex { font-size: 7.5em; }</style>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.2/dist/katex.min.js" integrity="sha384-Qsn9KnoKISj6dI8g7p1HBlNpVx0I8p1SvlwOldgi3IorMle61nQy4zEahWYtljaz" crossorigin="anonymous"></script>
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
		interaction.deferReply();
		const path = await generateImage(expression, interaction.id).catch(e => {
			interaction.followUp('Invalid LaTeX string.');
		});
		await interaction.followUp({ files: [ { attachment: path, name: path } ]});
		unlink(path, (e) => {});
	}
});

client.login(process.env.BOT_TOKEN);

async function generateImage(latexString, id) {
	try {
		const body = katex.renderToString(latexString, {
			throwOnError: true,
			transparent: true
		});
	
		let outputPath = `./images/${id}.png`;
	
		await nodeHtmlToImage({
			html: header + body + footer,
			output: outputPath
		});
	
		return outputPath;
	}
	catch(e) {
		throw 'Error';
	}
}