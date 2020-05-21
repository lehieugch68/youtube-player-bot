module.exports = {
	name: 'pause',
	execute(msg, args, client) {
		if(!msg.member.voice.channel) return msg.reply(`Có ở trong kênh nhạc đâu!`);
		client.player.pause(msg.guild.id).then(song => {
			return msg.channel.send({embed: {title: `Tạm dùng phát nhạc:`, description: `${song.title}`, thumbnail: {url: song.thumbnail} }});
		}).catch(err => {
			return msg.reply(`Lỗi: \`${err}\``);
		});
	},
};
