module.exports = {
	name: 'volume',
	execute(msg, args, client) {
		if(!msg.member.voice.channel) return msg.reply(`Có ở trong kênh nhạc đâu!`);
		let input = parseInt(args.join(" "));
		if (!input||isNaN(input)||input.length < 0) {
			client.player.getVolume(msg.guild.id).then(volume => {
				return msg.channel.send(`Âm lượng hiện tại: \`${volume}%\``);
			}).catch(err => {
				return msg.reply(`Lỗi: \`${err}\``);
			})
		} else {
			client.player.setVolume(msg.guild.id, input).then(() => {
				return msg.channel.send(`Chỉnh âm lượng thành: \`${input}%\``);
			}).catch(err => {
				return msg.reply(`Lỗi: \`${err}\``);
			});
		}
	},
};
