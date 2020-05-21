module.exports = {
	name: 'shuffle',
	execute(msg, args, client) {
		if(!msg.member.voice.channel) return msg.reply(`Có ở trong kênh nhạc đâu!`);
		client.player.shuffle(msg.guild.id).then((result) => {
			return msg.channel.send(`Đã xáo trộn ${result} bài trong danh sách phát!`);
		}).catch(err => {
			return msg.reply(`Lỗi: \`${err}\``);
		});
	},
};
