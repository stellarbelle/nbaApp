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

	app.post('/addSalary/:id', function(req, res) {
		players.addSalary(req, res);
	}),

	app.post('/removePlayer/:id', function(req, res) {
		players.removePlayer(req, res);
	}),

	app.post('/updatePlayer/:id', function(req, res) {
		players.updatePlayer(req, res);
	});
};
