const YoutubeAPI = require('../YoutubeAPI.js')

class Song {
    constructor(title, id, thumbnail) {
        this.title = title;
		this.url = (id !== null) ? `https://www.youtube.com/watch?v=${id}` : null;
		this.thumbnail = thumbnail;
    }
}

module.exports = {
  name: 'play',
  async execute(msg, args, client) {
    if(!msg.member.voice.channel) return msg.reply('Vào kênh âm nhạc trước đã!');
    let permissions = msg.member.voice.channel.permissionsFor(msg.client.user);
    if (!permissions.has('CONNECT')||!permissions.has('SPEAK')) msg.reply('Thiếu quyền vào kênh hoặc phát nhạc!');
    var input = args.join(" ").trim();
    if (!input||input.length < 1) return msg.reply('Hãy nhập tên hoặc URL bài hát!');
    let isPlaylist = input.match(/[?&]list=([^#\&\?]+)/);
    if (isPlaylist) {
      try {
        let playlist = await YoutubeAPI.getPlaylist(isPlaylist[1]);
        for (let video of Object.values(playlist)) {
          let song = new Song(video.snippet.title, video.snippet.resourceId.videoId, video.snippet.thumbnails.high.url);
          await client.player.play(msg.guild.id, song, msg.member.voice.channel);
        }
        return msg.channel.send(`Thêm vào danh sách phát: ${playlist.length} bài hát!`);
      } catch (err) {
				return msg.reply(`Lỗi: \`${err.message}\``);
			}
    } else {
      let isDirectUrl = input.match(/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/);
      if (isDirectUrl) {
        try {
					let id = isDirectUrl[1];
					var video = await YoutubeAPI.getVideo(id);
				} catch (err) {
					return msg.reply(`Lỗi: \`${err.message}\``);
				}
      } else {
				try {
					let videos = await YoutubeAPI.searchVideos(input, 10);
					let result = videos.map((item, i) => `**${i+1} -** ${item.snippet.title}`).join('\n');
					var reply = await msg.channel.send(`Chọn bài hát:\n\`\`\`${result}\`\`\``);
					try {
						var response = await msg.channel.awaitMessages(res => res.content > 0 && res.content < 11 && msg.author.id == res.author.id, {max: 1, time: 30000, errors: ['time']});
					} catch (e) {
						return reply.edit(`Lỗi: Không chọn được bài hát à?`);
					}
					let index = parseInt(response.first().content);
					var video = videos[index - 1];
					if (msg.guild.me.hasPermission('MANAGE_MESSAGES')) response.first().delete();
					reply.delete();
				} catch (err) {
					return msg.reply({`Lỗi: \`${err.message}\``);
				}
			}
			var song = new Song(video.snippet.title, video.id.videoId ? video.id.videoId : video.id, video.snippet.thumbnails.high.url);
			client.player.play(msg.guild.id, song, msg.member.voice.channel).then(result => {
				return msg.channel.send({embed: {title: `${result.message}:`, description: `${result.song.title}`, url: result.song.url, thumbnail: {url: result.song.thumbnail} }});
			}).catch(err => {
				return msg.reply(`Lỗi: \`${err}\``);
			});
    }
  }
}
