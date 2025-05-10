const mongoose = require('mongoose');

const postImpressionSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  viewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now }, // Ensure this field exists
});

module.exports = mongoose.model('PostImpression', postImpressionSchema);
