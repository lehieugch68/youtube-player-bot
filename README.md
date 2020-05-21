# Youtube Player Bot
Bot Discord phát nhạc từ Youtube.

Yêu cầu: [discord.js](https://www.npmjs.com/package/discord.js), @discordjs/opus, [ytdl-core](https://www.npmjs.com/package/ytdl-core), [ffmpeg-static](https://www.npmjs.com/package/ffmpeg-static) và [Youtube Data API Key](https://developers.google.com/youtube/registering_an_application).

```
npm i discord.js @discordjs/opus ytdl-core ffmpeg-static
```

Các lệnh:

```
_play: Phát nhạc, hỗ trợ link trực tiếp, playlist hoặc tìm kiếm video.
_pause: Tạm dừng.
_resume: Tiếp tục.
_skip: Bỏ qua bài đang phát.
_stop: Dừng phát.
_queue: Xem danh sách phát.
_clear: Xóa danh sách chờ phát.
_shuffle: Xáo trộn danh sách phát.
_repeat: Lặp lại bài đang phát.
_offrepeat: Dừng lặp lại.
_volume: Chỉnh hoặc xem âm lượng (theo %).
```
