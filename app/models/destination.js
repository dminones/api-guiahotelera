// Load required packages
var mongoose = require('mongoose')
, Schema = mongoose.Schema;

// Define our beer schema
var DestinationSchema   = new Schema({
  	name: String,
  	description: String,
  	image: String,
  	slug: String,
  	order: Number,
  	_parent : { type: Schema.ObjectId, ref: 'Destination' },
});

// Export the Mongoose model
module.exports = mongoose.model('Destination', DestinationSchema);