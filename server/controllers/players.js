var mongoose = require('mongoose');

var Player = mongoose.model('Player');

module.exports = (function() {
	return{
		showPlayers: function(req, res) {
			Player.find({}, function(err, players) {
				if(err) {
					console.log(err);
				} else {
					res.json(players);
				}
			});
		},

		showPlayer: function(req, res) {
			Player.findOne(
				{_id: req.params.id},
				function(err, player) {
					if(err) {
						console.log(err);
					} else {
						res.json(player);
					}
				}
			);
		},

		deletePlayer: function(req, res) {
			Player.remove(
				{_id: req.params.id},
				function(err, player) {
					if(err) {
						console.log(err);
					} else {
						res.json(player);
					}
				}
			);
		},

		createPlayer: function(req, res) {
		var player = new Player({name: req.body.name, position: req.body.position, salary: req.body.salary});
			player.save(function(err, player) {
				if(err) {
					console.log(err);
				} else {
					res.json(player);
				}
			});
		},

		updatePlayer: function(req, res) {
			Player.update({_id: req.params.id},
			 {name: req.body.name, position: req.body.position},
			 function(err, player) {
				if(err) {
					console.log(err);
				} else {
					res.json(player);
				}
			});
		},

		updateSalary: function(req, res) {
			Player.update({_id: req.params.id},
			 {salary: req.body.salary, secondaryPositions: req.body.secondaryPositions},
			 function(err, player) {
				if(err) {
					console.log(err);
				} else {
					res.json(player);
				}
			});
		}
	};
})();
