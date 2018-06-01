import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const DestinationsBlockSchema = new Schema({
  	site: {
        type: String,
        required: [true, 'Site es obligatorio'],
        unique:  [true, 'Ya existe un listado de destinos para este sitio'],
    },
    destinations: [
        { type: Schema.ObjectId, ref: 'Destination' }
    ]
}, {
    timestamps: true
})

export default mongoose.model('DestinationsBlock', DestinationsBlockSchema);
