// Load required packages
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);
const { Schema } = mongoose;

// Define our beer schema
const ItemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    validate: {
      isAsync: true,
      validator: function(v) {
        return v && v != '';
      },
      message: () => `slug required`,
    },
  },
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
  bookOnline: String,
  publicationType: String,
  gallery: [
    { src: String },
  ],
  _destination: { type: Schema.ObjectId, ref: 'Destination' },
  _accommodationType: { type: Schema.ObjectId, ref: 'AccommodationType' },
  category: String,
}, {
  timestamps: true,
});

// ItemSchema.path('slug').validate(function(value) {
//   // When running in `validate()` or `validateSync()`, the
//   // validator can access the document using `this`.
//   // Does **not** work with update validators.
//   console.log("Validating on update", this)
//   // if (this.name.toLowerCase().indexOf('red') !== -1) {
//   //   return value !== 'red';
//   // }

//   return false;
// });

// Export the Mongoose model
module.exports = mongoose.model('Item', ItemSchema);
