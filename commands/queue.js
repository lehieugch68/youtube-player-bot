module.exports = {
	name: 'queue',
	execute(msg, args, client) {
		if(!msg.member.voice.channel) return msg.reply(`Có ở trong kênh nhạc đâu!`);
		client.player.getQueue(msg.guild.id).then(queue => {
			let result = queue.map((song, i) => {
        		return `${i === 0 ? 'Đang phát' : `${i}`}- ${song.title}`
    		}).join('\n');
    		if (result.length > 1024) result = `${result.substring(0, 1021)}...`;
    		return msg.channel.send({embed: {title: 'Danh sách phát', description: `${result}`}});
		}).catch(err => {
			return msg.reply(`Lỗi: \`${err}\``);
		});
	},
};
