const mongoose = require('mongoose');
const express = require('express');
const PostImpression = require('../model/PostImpression');
const router = express.Router();

router.post('/api/post-impression', async (req, res) => {
  const { postId, viewerId } = req.body;

  if (!postId || !viewerId) {
    return res.status(400).json({ message: 'Missing postId or viewerId.' });
  }

  console.log('Received post impression:', { postId, viewerId });

  try {
    await PostImpression.create({ postId, viewerId });
    res.status(200).json({ message: 'Post impression recorded.' });
  } catch (error) {
    console.error('Error recording post impression:', error);
    res.status(500).json({ message: 'Error recording post impression.' });
  }
});




router.get('/api/post-impressions/trends/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    const data = await PostImpression.aggregate([
      { $match: { postId: new mongoose.Types.ObjectId(postId) } }, // Add 'new' here
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching post impression trends:', error);
    res.status(500).json({ message: 'Error fetching post impression trends.' });
  }
});


  module.exports = router;
    