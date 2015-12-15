var mongoose = require('mongoose');

var fs = require('fs');

mongoose.connect('mongodb://localhost/nba_players');

var models_path = __dirname + '/../server/models'

// reads through model for .js
fs.readdirSync(models_path).forEach(function(file){
	if(file.indexOf('.js') > 0){
		require(models_path + '/' + file);
	}
})