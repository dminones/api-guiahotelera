import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const SiteSchema = new Schema({
  	slug: {
        type: String,
        required: [true, 'Site Slug is required.'],
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'Site Nane is required.'],
    },
    logo: {
        type: String,
        required: [true, 'Site Logo is required.'],
    }
});

const SiteModel = mongoose.model('Site', SiteSchema);

export default SiteModel;
