import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const { SiteModel } = require('./common/site_model')

const DestionationItemSchema = new Schema(
    { 
        destination: { type: Schema.ObjectId, ref: 'Destination' },
        order: Number
    }
)
mongoose.model('DestionationItem', DestionationItemSchema);

const DestinationsBlockSchema = new Schema({
  	site: {
        type: SiteModel.type,
        enum: SiteModel.enum,
        required: [true, 'Site es obligatorio'],
        unique:  [true, 'Ya existe un listado de destinos para este sitio'],
    },
    destinations: [
        { type: Schema.ObjectId, ref: 'DestionationItem' }
    ]
}, {
    timestamps: true
})

export default mongoose.model('DestinationsBlock', DestinationsBlockSchema);
