module.exports = {
	name: 'offrepeat',
	execute(msg, args, client) {
		if(!msg.member.voice.channel) return msg.reply(`Có ở trong kênh nhạc đâu!`);
		client.player.setRepeat(msg.guild.id, false).then(song => {
			return msg.channel.send({embed: {title: `Ngừng lặp lại bài:`, description: `${song.title}`, thumbnail: {url: song.thumbnail}}});
		}).catch(err => {
			return msg.reply(`Lỗi: \`${err}\``);
		});
	},
};
