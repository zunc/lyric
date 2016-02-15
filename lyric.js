var _global = {
	port: 80
};

var express = require('express');
var app = express();
var request = require('request');

app.get('/lyric', function (req, res) {
	var strSong = req.query.song;
	console.log('[-] Request: ' + strSong);
	//res.send('get song: ' + strSong);

	var preUrl = 'http://ac.mp3.zing.vn/complete?type=artist,album,video,song&num=4&callback=jQuery210007569393399171531_1452762760980&query=';
	var url = preUrl + strSong;
	request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var json = JSON.parse(body);
			var song = undefined;
			if (json.result && json.data.length > 0) {
				for (ix in json.data) {
					data = json.data[ix];
					if (data.song !== undefined) {
						var songData = data.song[0];
						if (songData !== undefined) {
							console.log(songData);
							song = {
								artist: songData.artist,
								name: songData.name,
								id: songData.id};
							console.log(' -> id: ' + song.id);
							break;
						}
					}
				}
			}

			if (song !== undefined) {
				var preLyric = 'http://mp3.zing.vn/xhr/song/get-lyrics?songid=';
				var urlLyric = preLyric + song.id;
				request(urlLyric, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						var jsonLyric = JSON.parse(body);
						var strLyric = jsonLyric.data[0].content;
						console.log(strLyric);

						res.send({
							error: 0,
							song: song.name,
							artist: song.artist,
							lyric: strLyric
						});
					} else {
						res.send({
							error: -3,
							msg: 'get song failed'
						});
					}
				});
			} else {
				res.send({
					error: -2,
					msg: 'song not found'
				});
			}
		} else {
			res.send({
				error: -1,
				msg: 'request failed'
			});
			console.log('request failed: ' + song.id);
		}
	});
});

app.get('/', function (req, res) {
	res.send('nothing');
});

var server = app.listen(_global.port, function () {
	var host = server.address().address
	var port = server.address().port
	console.log("Server started on: http://%s:%s", host, port)
});