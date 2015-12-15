var mongoose = require('mongoose');

var Player = mongoose.model('Player');

module.exports = (function() {
	return{
		showPlayers: function(req, res) {
			Player.find({}, function(err, players) {
				if(err) {
					console.log(err);
				} else {
					res.json(players)
				}
			})
		},

		showPlayer: function(req, res) {
			Player.findOne({_id: req.params.id}, function(err, player) {
				if(err) {
					console.log(err);
				} else {
					res.json(player)
				}
			})
		},

		createPlayer: function(req, res) {
		var dt = new Date();
		dt = dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate();
		var player = new Player({name: req.body.name, position: req.body.position, salary: req.body.salary, date: dt});
			player.save(function(err, player) {
				if(err) {
					console.log(err); 
				} else {
					res.json(player);
				}
			})
		},

		updatePlayer: function(req, res) {
			console.log("controller: ", req.body, req.body.name)
			Player.update({_id: req.params.id},
			 {name: req.body.name, position: req.body.position, salary: req.body.salary}, 
			 function(err, player) {
				if(err) {
					console.log(err); 
				} else {
					res.json(player);
				}
			})
		}
	}
})();