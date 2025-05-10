const express = require('express');
const mongoose = require('mongoose');
const { getUserSuggestions } = require('../controller/controller');
const User = require('../model/usermodel');
const router = express.Router();

// Utility function to validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
// GET route to fetch user suggestions
router.get('/', getUserSuggestions);

// POST route for sending connection requests
router.post('/connect', async (req, res) => {
  const { userId, targetUserId } = req.body;

  if (!userId || !targetUserId) {
    return res.status(400).json({ message: 'Invalid userId or targetUserId.' });
  }

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(targetUserId)) {
    return res.status(400).json({ message: 'Invalid MongoDB ObjectId format.' });
  }

  try {
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Initialize arrays if undefined
    user.pendingRequests = user.pendingRequests || [];
    targetUser.pendingRequests = targetUser.pendingRequests || [];

    if (!user.pendingRequests.includes(targetUserId)) {
      user.pendingRequests.push(targetUserId);
    }
    if (!targetUser.pendingRequests.includes(userId)) {
      targetUser.pendingRequests.push(userId);
    }

    await user.save();
    await targetUser.save();

    res.status(200).json({
      message: 'Connection request sent.',
      user: { id: user._id, pendingRequests: user.pendingRequests },
      targetUser: { id: targetUser._id, pendingRequests: targetUser.pendingRequests },
    });
  } catch (error) {
    console.error("Error in /connect route:", error.message);
    res.status(500).json({ message: 'Failed to send connection request.', error: error.message });
  }
});

// Other routes for accept, decline, and block would remain the same
module.exports = router;

router.get('/mynetwork', async (req, res) => {
  const { userId } = req.query;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid userId.' });
  }

  try {
    const user = await User.findById(userId)
      .populate('connections', 'name profilePicture jobTitle')
      .populate('pendingRequests', 'name profilePicture jobTitle')
      .populate('connectionRequests', 'name profilePicture jobTitle')
      .populate('blockedUsers', 'name profilePicture jobTitle');

    console.log("User connections:", user.connections);  // Log user's connections

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({
      connections: user.connections || [],
      pendingRequests: user.pendingRequests || [],
      connectionRequests: user.pendingRequests || [],
      blockedUsers: user.blockedUsers || [],
    });
  } catch (error) {
    console.error('Error in /mynetwork route:', error);
    res.status(500).json({ message: 'Failed to fetch network.' });
  }
});


router.post('/accept', async (req, res) => {
  const { userId, targetUserId } = req.body;
  console.log("Accepting connection for userId:", userId);
  console.log("Accepting connection for targetUserId:", targetUserId);

  // Validate userId and targetUserId
  if (!userId || !targetUserId || !isValidObjectId(userId) || !isValidObjectId(targetUserId)) {
    return res.status(400).json({ message: 'Invalid userId or targetUserId.' });
  }

  try {
    // Find the user and check if they have a pending request from targetUserId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the user has a pending request from the targetUserId
    if (!user.pendingRequests.includes(targetUserId)) {
      return res.status(400).json({ message: 'No pending connection request from this user.' });
    }

    // Remove the targetUserId from the pendingRequests and add it to connections
    const userUpdate = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { pendingRequests: targetUserId }, // Use pendingRequests instead of connectionRequests
        $addToSet: { connections: targetUserId },
      },
      { new: true } // Return the updated document
    );

    console.log("Updated user after accepting:", userUpdate); // Log updated user

    // Now add the userId to the targetUser's connections
    const targetUserUpdate = await User.findByIdAndUpdate(
      targetUserId,
      {
        $addToSet: { connections: userId },
      },
      { new: true } // Return the updated document
    );

    console.log("Updated target user after accepting:", targetUserUpdate); // Log updated target user

    res.status(200).json({ message: 'Connection request accepted!' });
  } catch (error) {
    console.error('Error accepting connection:', error); // Detailed error log
    res.status(500).json({ message: 'Failed to accept connection.', error: error.message });
  }
});



// POST route for declining connection requests
router.post('/decline', async (req, res) => {
  const { userId, targetUserId } = req.body;

  // Validate userId and targetUserId
  if (!userId || !targetUserId || !isValidObjectId(userId) || !isValidObjectId(targetUserId)) {
    return res.status(400).json({ message: 'Invalid userId or targetUserId.' });
  }

  try {
    // Remove from connection requests
    await User.findByIdAndUpdate(userId, {
      $pull: { connectionRequests: targetUserId },
    });

    res.status(200).json({ message: 'Connection request declined.' });
  } catch (error) {
    console.error('Error declining connection:', error);
    res.status(500).json({ message: 'Failed to decline connection.' });
  }
});

// POST route for blocking a user
router.post('/block', async (req, res) => {
  const { userId, targetUserId } = req.body;

  // Validate userId and targetUserId
  if (!userId || !targetUserId || !isValidObjectId(userId) || !isValidObjectId(targetUserId)) {
    return res.status(400).json({ message: 'Invalid userId or targetUserId.' });
  }

  try {
    // Add the target user to the block list and remove from connections and requests
    await User.findByIdAndUpdate(userId, {
      $addToSet: { blockedUsers: targetUserId },
      $pull: { connections: targetUserId, connectionRequests: targetUserId },
    });

    res.status(200).json({ message: 'User blocked successfully.' });
  } catch (error) {
    console.error('Error blocking user:', error);
    res.status(500).json({ message: 'Failed to block user.' });
  }
});

module.exports = router;
