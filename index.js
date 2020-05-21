const Discord = require('discord.js');
const client = new Discord.Client();
const TOKEN = ''; //token bot
const PREFIX = '_';

const options = {
	timeOut: 180
}
const YoutubePlayer = require('./YoutubePlayer.js');
const youtubePlayer = new YoutubePlayer(client, options);
client.youtubePlayer = youtubePlayer;

const fs = require('fs');
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
})

client.on('message', async msg => {
  if (msg.author.bot) return;
  
  if (msg.content.toLowerCase().startsWith(PREFIX)) {
	const args = msg.content.slice(PREFIX.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (command == null) return;
	try {
		command.execute(msg, args, client);
	} catch (error) {
		return msg.reply(`Xảy ra lỗi khi thực hiện lệnh này:\n\`${error.message}\``);
	}
   }
})

client.login(TOKEN)
