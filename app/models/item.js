// Load required packages
var mongoose = require('mongoose')
, Schema = mongoose.Schema;

// Define our beer schema
var ItemSchema   = new Schema({
  name: String,
  address: String,
  phone: String,
  email: String,
  web: String,
  facebook: String,
  twitter: String,
  instagram: String,
  thumbnail: String,
  logoImage: String,
  overview: String,
  location: String,
  booking: String,
  publicationType: String,
  _destination : { type: Schema.ObjectId, ref: 'Destination' },
  _accommodationType : { type: Schema.ObjectId, ref: 'AccommodationType' },
  category : String,
});


// Export the Mongoose model
module.exports = mongoose.model('Item', ItemSchema);