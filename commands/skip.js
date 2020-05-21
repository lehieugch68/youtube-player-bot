module.exports = {
	name: 'skip',
	execute(msg, args, client) {
		if(!msg.member.voice.channel) return msg.reply(`Có ở trong kênh nhạc đâu!`);
		client.player.skip(msg.guild.id).then(song => {
			return msg.channel.send({embed: {title: `Bỏ qua bài hát:`, description: `${song.title}`, thumbnail: {url: song.thumbnail} }});
		}).catch(err => {
			return msg.reply(`Lỗi: \`${err}\``);
		});
	},
};
