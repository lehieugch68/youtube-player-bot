const ytdl = require('ytdl-core')

class Queue {
	constructor(voiceChannel) {
		this.voiceChannel = voiceChannel;
		this.connection = null;
		this.songs = [];
		this.volume = 100;
		this.playing = true;
		this.repeat = false;
	}
}

class YoutubePlayer {
	constructor(client, options = {timeOut: 3}) {
		this.client = client;
		this.queue = new Map();
		/*client.on('voiceStateUpdate', (oldState, newState) => {
			if (!oldState.channel.id||newState.channel.id) return undefined;
			if (this.queue.get(oldState.guild.id)) this.queue.delete(oldState.guild.id);
		})*/
	}

	play(guildID, voiceChannel, song) {
		return new Promise(async (resolve, reject) => {
			let serverQueue = this.queue.get(guildID);
			if (!serverQueue) {
				let queue = new Queue(voiceChannel);
				queue.songs.push(song);
				voiceChannel.join().then(connection => {queue.connection = connection;}).catch(err => {reject(err)});
				this.queue.set(guildID, queue);
				console.log(serverQueue, this.queue.get(guildID));
			} else {
				serverQueue.songs.push(song);
				if (serverQueue.songs > 1) resolve({message: "Thêm vào hàng chờ", song: song});
			}
			this.PlaySong(guildID);
			resolve({message: "Bắt đầu phát", song: song});
		})
	}

	stop(guildID) {
		return new Promise(async (resolve, reject) => {
			let serverQueue = this.queue.get(guildID);
			if (!serverQueue) reject("Có đang phát bài nào đâu!");
			serverQueue.songs = [];
			serverQueue.connection.dispatcher.end();
			resolve();
		})
	}

	async PlaySong(guildID) {
		let serverQueue = this.queue.get(guildID);
		if (!serverQueue) return undefined;
		if (serverQueue.songs < 1) {
			setTimeout(() => {
				console.log(serverQueue);
				//let serverQueue = this.queue.get(guildID);
				if (serverQueue.songs < 1) return serverQueue.voiceChannel.leave();
			}, serverQueue.options.timeOut*1000);
		}
		let song = serverQueue.songs[0];
		let dispatcher = serverQueue.connection.play(ytdl(song.url, {quality: 'highestaudio', highWaterMark: 1<<25, type: 'opus'}), {volume: serverQueue.volume/100});
		dispatcher.on('finish', () => {
			if (!serverQueue.repeat) serverQueue.songs.shift();
			return this.PlaySong(guildID);
		})
	}
}

module.exports = YoutubePlayer;