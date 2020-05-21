module.exports = {
	name: 'clear',
	execute(msg, args, client) {
		if(!msg.member.voice.channel) return msg.reply(`Có ở trong kênh nhạc đâu!`);
		client.player.clearQueue(msg.guild.id).then(count => {
			return msg.channel.send(`Xóa ${count} bài hát khỏi hàng chờ!`);
		}).catch(err => {
			return msg.reply(`Lỗi: \`${err}\``);
		});
	},
};
