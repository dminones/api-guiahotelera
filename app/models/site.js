import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const SiteSchema = new Schema({
  	name: {
        type: String,
        required: [true, 'Site Nane is required.'],
    },
    logo: {
        type: String,
        required: [true, 'Site Logo is required.'],
    },
    home: [{ type: Schema.ObjectId, ref: 'DestinationsBlock' }]
}, {
	timestamps: true,
	usePushEach: true
})

SiteSchema.virtual('destinations').get(function () {
    return this.home.join(',');
  })

const SiteModel = mongoose.model('Site', SiteSchema);

export default SiteModel;