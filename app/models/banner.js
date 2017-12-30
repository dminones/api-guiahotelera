// Load required packages
var mongoose = require('mongoose')
, Schema = mongoose.Schema;

// Define our beer schema
var schema   = new Schema({
  	name: String,
  	src: String,
  	link: String,
  	target: String,
  	order: Number,
  	_destination : { type: Schema.ObjectId, ref: 'Destination' },
});

// Export the Mongoose model
module.exports = mongoose.model('Banner', schema);