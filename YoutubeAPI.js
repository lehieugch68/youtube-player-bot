const GOOGLE_API_KEY = ''; //API key
const GOOGLE_API_URL = 'https://www.googleapis.com/youtube/v3/';
const https = require('https');

module.exports = {
	request(url) {
		return new Promise (async (resolve, reject) => {
			https.get(url, resp => {
				var data = '';
				resp.on('data', chunk => {
					data += chunk;
				});
				resp.on('end', () => {
					return resolve(data);
				});
			}).on("error", err => {
				return reject(err);
			})
		})
	},
	searchVideos(query, maxResults) {
		return new Promise(async (resolve, reject) =>{
			let q = query.replace(/\s/g, "%20");
			let url = `${GOOGLE_API_URL}search?part=snippet&maxResults=${maxResults}&q=${q}&key=${GOOGLE_API_KEY}`;
			request(url).then(res => {
				let result = JSON.parse(res);
				return resolve(result.items);
			}).catch(err => {
				return reject(err);
			})
		})
	},
	getVideo(id) {
		return new Promise(async (resolve, reject) => {
			let url = `${GOOGLE_API_URL}videos?part=snippet&id=${id}&key=${GOOGLE_API_KEY}`;
			request(url).then(res => {
				let result = JSON.parse(res);
				return resolve(result.items);
			}).catch(err => {
				return reject(err);
			})
		})
	},
	getPlaylist(id) {
		return new Promise(async (resolve, reject) => {
			let url = `${GOOGLE_API_URL}playlistItems?part=snippet&maxResults=50&playlistId=${id}&key=${GOOGLE_API_KEY}`;
			request(url).then(res => {
				let result = JSON.parse(res);
				return resolve(result.items);
			}).catch(err => {
				return reject(err);
			})
		});
	},
}
