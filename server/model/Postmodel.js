// const mongoose = require('mongoose');

// const postSchema = new mongoose.Schema( 
//   {
//     content: { type: String, required: true, trim: true },
//     imageUrl: { 
//       type: String, 
//       validate: { 
//         validator: (url) => /^https?:\/\/.+$/.test(url), 
//         message: 'Invalid URL' 
//       } 
//     },
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
//     likes: { type: [String], default: [] },
//     createdAt: { type: Date, default: Date.now },
//   },
//   { 
//     timestamps: true, // Adds `createdAt` and `updatedAt`
//     indexes: [{ createdAt: 1 }] // Index `createdAt` for fast querying by date
//   }
// );

// module.exports = mongoose.model('Post', postSchema);
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    content: { type: String, required: true, trim: true },
    imageUrl: {
      type: String,
      validate: {
        validator: (url) => /^https?:\/\/.+$/.test(url),
        message: 'Invalid URL',
      },
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    likes: { type: [String], default: [] }, // Array of user IDs who liked the post
    comments: [
      {
        content: { type: String, required: true, trim: true }, // Comment text
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who commented
        createdAt: { type: Date, default: Date.now }, // Timestamp of the comment
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt`
    indexes: [{ createdAt: 1 }], // Index `createdAt` for fast querying by date
  }
);

module.exports = mongoose.model('Post', postSchema);