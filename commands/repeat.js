module.exports = {
	name: 'repeat',
	execute(msg, args, client) {
		if(!msg.member.voice.channel) return msg.reply(`Có ở trong kênh nhạc đâu!`);
		client.player.setRepeat(msg.guild.id, true).then(song => {
			return msg.channel.send({embed: {title: `Lặp lại bài hát:`, description: `${song.title}`, thumbnail: {url: song.thumbnail}}});
		}).catch(err => {
			return msg.reply(`Lỗi: \`${err}\``);
		});
	},
};
