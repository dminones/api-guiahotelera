// Load required packages
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const { headProperties } = require('./common/head_properties');
const { SiteModel } = require('./common/site_model')
// Define our beer schema
const DestinationSchema = new Schema(
    {
      ...headProperties,
      name: String,
      description: String,
      image: String,
      slug: String,
      order: Number,
      _parent: { type: Schema.ObjectId, ref: 'Destination' },
      site: SiteModel,
    },
    {
      timestamps: true,
    }
);

// Export the Mongoose model
module.exports = mongoose.model('Destination', DestinationSchema);
