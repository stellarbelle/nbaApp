var mongoose = require('mongoose');

var PlayerSchema = new mongoose.Schema({
	name: String,
	position: String,
	salary: Number,
	secondaryPositions: Array,
	secondaryPositionsOpts: Array
});

mongoose.model('Player', PlayerSchema);
