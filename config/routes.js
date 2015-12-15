var players = require('./../server/controllers/players.js');

module.exports = function(app) {

	app.post('/createPlayer', function(req, res) {
		console.log("routes: ", req.body)
		players.createPlayer(req, res);

	}),

	app.get('/showPlayers', function(req, res) {
		players.showPlayers(req, res);
	}),

	app.get('/showPlayer/:id', function(req, res) {
		players.showPlayer(req, res);
	}),

	app.post('/updatePlayer/:id', function(req, res) {
		console.log("routes: ", req.body)
		players.updatePlayer(req, res);
	})
};