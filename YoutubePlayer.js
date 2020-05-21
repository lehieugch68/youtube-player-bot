const ytdl = require('ytdl-core')
const Shuffle = require('./shuffle.js')

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
	constructor(client, options = {timeOut: 60}) {
		this.client = client;
		this.options = options;
		this.queue = new Map();
		client.on('voiceStateUpdate', (oldState, newState) => {
			if (!oldState.channelID||newState.channelID) return undefined;
			if (this.queue.get(oldState.guild.id) && this.client.user.id === oldState.id) return this.queue.delete(oldState.guild.id);
		})
	}
	isPlaying(guildID) {
		let serverQueue = this.queue.get(guildID);
		return !serverQueue ? false : serverQueue.playing;
	}
	play(guildID, song, voiceChannel) {
		return new Promise(async (resolve, reject) => {
			let serverQueue = this.queue.get(guildID);
			if (!serverQueue) {
				let queue = new Queue(voiceChannel);
				queue.songs.push(song);
				try {
					queue.connection = await voiceChannel.join();
				} catch (err) {
					return reject(err);
				}
				this.queue.set(guildID, queue);
			} else {
				serverQueue.songs.push(song);
				if (serverQueue.songs.length > 1) return resolve({message: "Thêm vào hàng chờ", song: song});
			}
			this.PlaySong(guildID);
			return resolve({message: "Bắt đầu phát", song: song});
		})
	}
	stop(guildID) {
		return new Promise(async (resolve, reject) => {
			let serverQueue = this.queue.get(guildID);
			if (!serverQueue||serverQueue.songs.length < 1) return reject("Có bài nào đang phát đâu!");
			let count = serverQueue.songs.length;
			serverQueue.songs = [];
			serverQueue.connection.dispatcher.end();
			return resolve(count);
		})
	}
	pause(guildID){
        	return new Promise(async(resolve, reject) => {
            		let serverQueue = this.queue.get(guildID);
			if (!serverQueue||serverQueue.songs.length < 1) return reject("Có bài nào đang phát đâu!");
            		if (serverQueue.connection.dispatcher.paused) return reject('Đang tạm dừng rồi!');
            		serverQueue.connection.dispatcher.pause();
            		return resolve(serverQueue.songs[0]);
        	});
    	}
    	resume(guildID){
        	return new Promise(async(resolve, reject) => {
            		let serverQueue = this.queue.get(guildID);
			if (!serverQueue||serverQueue.songs.length < 1) return reject("Có bài nào đang phát đâu!");
            		if (!serverQueue.connection.dispatcher.paused) return reject('Có bài nào đang tạm dừng đâu!');
            		serverQueue.connection.dispatcher.resume();
            		return resolve(serverQueue.songs[0]);
        	});
    	}
	skip(guildID) {
		return new Promise(async (resolve, reject) => {
			let serverQueue = this.queue.get(guildID);
			if (!serverQueue||serverQueue.songs.length < 1) return reject("Có bài nào đang phát đâu!");
			serverQueue.connection.dispatcher.end();
			return resolve(serverQueue.songs[0]);
		})
	}
	getQueue(guildID) {
        	return new Promise(async(resolve, reject) => {
            		let serverQueue = this.queue.get(guildID);
			if (!serverQueue||serverQueue.songs.length < 1) return reject("Có bài nào đang phát đâu!");
            		return resolve(serverQueue.songs);
        	});
    	}
    	clearQueue(guildID){
        	return new Promise(async(resolve, reject) => {
            		let serverQueue = this.queue.get(guildID);
			if (!serverQueue||serverQueue.songs.length < 1) return reject("Có bài nào đang phát đâu!");
            		let song = serverQueue.songs.shift();
            		let count = serverQueue.songs.length;
            		serverQueue.songs = [song];
            		return resolve(count);
        	});
    	}
    	setVolume(guildID, volume) {
        	return new Promise(async(resolve, reject) => {
            		let serverQueue = this.queue.get(guildID);
			if (!serverQueue||serverQueue.songs.length < 1) return reject("Có bài nào đang phát đâu!");
            		serverQueue.volume = volume;
            		serverQueue.connection.dispatcher.setVolume(volume/100);
            		console.log(this.queue.get(guildID).volume);
            		return resolve();
        	});
    	}
    	getVolume(guildID) {
        	return new Promise(async(resolve, reject) => {
            		let serverQueue = this.queue.get(guildID);
			if (!serverQueue||serverQueue.songs.length < 1) return reject("Có bài nào đang phát đâu!");
            		return resolve(serverQueue.volume);
        	});
    	}
    	setRepeat(guildID, mode) {
        	return new Promise(async(resolve, reject) => {
            		let serverQueue = this.queue.get(guildID);
			if (!serverQueue||serverQueue.songs.length < 1) return reject("Có bài nào đang phát đâu!");
            		let song = serverQueue.songs[0];
            		serverQueue.repeat = mode;
            		return resolve(song);
        	});
    	}
    	shuffle(guildID) {
        	return new Promise(async(resolve, reject) => {
            		let serverQueue = this.queue.get(guildID);
			if (!serverQueue||serverQueue.songs.length < 1) return reject("Có bài nào đang phát đâu!");
            		Shuffle(serverQueue.songs);
            		return resolve(serverQueue.songs.length);
        	});
    	}
	async PlaySong(guildID) {
		let serverQueue = this.queue.get(guildID);
		if (!serverQueue) return undefined;
		if (serverQueue.songs.length < 1) {
			setTimeout(() => {
				let ServerQueue = this.queue.get(guildID);
				if (!ServerQueue) return undefined;
				if (ServerQueue.songs.length < 1) return ServerQueue.voiceChannel.leave();
			}, this.options.timeOut*1000);
		} else {
			let song = serverQueue.songs[0];
			let dispatcher = serverQueue.connection.play(ytdl(song.url, {quality: 'highestaudio', highWaterMark: 1<<25, type: 'opus'}), {volume: serverQueue.volume/100});
			dispatcher.on('finish', () => {
				if (!serverQueue.repeat) serverQueue.songs.shift();
				return this.PlaySong(guildID);
			})
		}
	}
}

module.exports = YoutubePlayer;
