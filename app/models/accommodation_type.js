// Load required packages
var mongoose = require('mongoose')
, Schema = mongoose.Schema;

// Define our schema
var AccommodationTypeSchema   = new Schema({
  	name: String,
  	order: Number
});

// Export the Mongoose model
module.exports = mongoose.model('AccommodationType', AccommodationTypeSchema);