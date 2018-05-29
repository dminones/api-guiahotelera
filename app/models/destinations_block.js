import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const DestinationsBlockSchema = new Schema({
  	name: {
        type: String,
        required: [true, 'Block Nane es oblicagorio.'],
    },
    destinations: [
        { type: Schema.ObjectId, ref: 'Destination' }
    ]
}, {
    timestamps: true
})

export default mongoose.model('DestinationsBlock', DestinationsBlockSchema);
