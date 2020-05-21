module.exports = {
	name: 'stop',
	execute(msg, args, client) {
		if(!msg.member.voice.channel) return msg.reply(`Có ở trong kênh nhạc đâu!`);
		client.player.stop(msg.guild.id).then(count => {
			return msg.channel.send(`Dừng ${count} bài hát!`);
		}).catch(err => {
			return msg.reply(`Lỗi: \`${err}\``);
		});
	},
};
