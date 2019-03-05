// Load required packages
import mongoose from 'mongoose';
const { Schema } = mongoose;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const { headProperties } = require('./common/head_properties');

const PostSchema = new Schema({
  ...headProperties,
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  slug: {
    type: String,
    unique: true,
    slug: 'title',
    validate: {
      isAsync: false,
      validator: function(v) {
        return v && v != '';
      },
      message: () => `slug required`,
    },
  },
  // media: { type: Schema.Types.ObjectId, ref: 'Media' },
  // likes : [{ type: Schema.Types.ObjectId, ref: 'Like' }],
  // comments : [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  // flags : [{ type: Schema.Types.ObjectId, ref: 'Flag' }]
  // user: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
});

const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;
