var mongoose = require('mongoose');

var PlayerSchema = new mongoose.Schema({
	name: String,
	position: String,
	salary: Number,
	date: String
});

mongoose.model('Player', PlayerSchema);