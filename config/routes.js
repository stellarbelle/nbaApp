var players = require('./../server/controllers/players.js');

module.exports = function(app) {

	app.post('/createPlayer', function(req, res) {
		players.createPlayer(req, res);

	}),

	app.get('/showPlayers', function(req, res) {
		players.showPlayers(req, res);
	}),

	app.get('/showPlayer/:id', function(req, res) {
		players.showPlayer(req, res);
	}),

	app.post('/updateSalary/:id', function(req, res) {
		players.updateSalary(req, res);
	}),

	app.post('/removePlayer/:id', function(req, res) {
		players.removePlayer(req, res);
	}),

	app.post('/deletePlayer/:id', function(req, res) {
		players.deletePlayer(req, res);
	}),

	app.post('/updatePlayer/:id', function(req, res) {
		players.updatePlayer(req, res);
	});
};
