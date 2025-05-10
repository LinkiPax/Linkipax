// const express = require('express');
// const router = express.Router();
// const Post = require('../model/Postmodel');
// const mongoose = require('mongoose');
// const Notification = require('../model/notificationschema');
// const User = require('../model/usermodel');
// const { io } = require('../server'); // Importing io from server.js
// // Get all posts with pagination
// router.get('/', async (req, res) => {
//   try {
//     const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
//     const skip = (page - 1) * limit;

//     const posts = await Post.find()
//       .populate('createdBy', 'name profilePicture')
//       .sort({ createdAt: -1 }) // Most recent first
//       .skip(skip) // Skip posts based on page
//       .limit(Number(limit)); // Limit the number of posts per page

//     res.json(posts);
//   } catch (error) {
//     console.error('Error fetching posts:', error); // Log the error for debugging
//     res.status(500).json({ error: 'Failed to fetch posts', details: error.message });
//   }
// });

// // Get posts by user ID
// router.get('/user/:userId', async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const posts = await Post.find({ createdBy: userId })
//       .populate('createdBy', 'name profilePicture')
//       .sort({ createdAt: -1 }); // Most recent first

//     res.json(posts);
//   } catch (error) {
//     console.error('Error fetching posts by user ID:', error); // Log the error for debugging
//     res.status(500).json({ error: 'Failed to fetch posts by user ID', details: error.message });
//   }
// });
// // Create a new post
// router.post('/', async (req, res) => {
//   try {
//     const { content, imageUrl, createdBy } = req.body;
    
//     // Validate input
//     if (!content || !createdBy) {
//       return res.status(400).json({ error: 'Content and CreatedBy are required' });
//     }
    
//     if (imageUrl && !/^https?:\/\/.+$/.test(imageUrl)) {
//       return res.status(400).json({ error: 'Invalid image URL' });
//     }
    
//     if (!mongoose.Types.ObjectId.isValid(createdBy)) {
//       return res.status(400).json({ error: 'Invalid user ID' });
//     }
    
//     const newPost = new Post({ content, imageUrl, createdBy });
//     const savedPost = await newPost.save();
    
//     // Create a notification for the new post
//     const newNotification = new Notification({
//       userId: createdBy, 
//       notification: 'A new post has been created!',
//       date: new Date(),
//     });
    
//     await newNotification.save(); 
    
//     // Emit a new notification to all connected clients
//     io.emit('new_notification', newNotification);
    
//     res.status(201).json(savedPost);
//   } catch (error) {
//     console.error('Error creating post:', error);
//     res.status(500).json({ error: 'Failed to create post', details: error.message });
//   }
// });
// router.post("/like/:postId", async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const { userId } = req.body;
    
//     console.log("Received like request for post:", postId, "by user:", userId);
    
//     if (!mongoose.Types.ObjectId.isValid(postId)) {
//       return res.status(400).json({ message: "Invalid post ID" });
//     }

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: "Invalid user ID" });
//     }
    
//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }
    
//     post.likes = post.likes || [];
    
//     const isLiked = post.likes.includes(userId.toString());
    
//     if (isLiked) {
//       post.likes = post.likes.filter((id) => id !== userId.toString());
//     } else {
//       post.likes.push(userId.toString());
//     }

//     await post.save();
    
//     res.json({ likes: post.likes.length, liked: !isLiked });
//   } catch (error) {
//     console.error("Error in like API:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// module.exports = router;

// Create a new post
// router.post('/', async (req, res) => {
//   try {
//     const { content, imageUrl, createdBy } = req.body;

//     // Validate input
//     if (!content || !createdBy) {
//       return res.status(400).json({ error: 'Content and CreatedBy are required' });
//     }

//     // Validate imageUrl if provided
//     if (imageUrl && !/^https?:\/\/.+$/.test(imageUrl)) {
//       return res.status(400).json({ error: 'Invalid image URL' });
//     }

//     // Validate that createdBy is a valid ObjectId
//     if (!mongoose.Types.ObjectId.isValid(createdBy)) {
//       return res.status(400).json({ error: 'Invalid user ID' });
//     }

//     const newPost = new Post({ content, imageUrl, createdBy });
//     const savedPost = await newPost.save();

//     res.status(201).json(savedPost);
//   } catch (error) {
//     console.error('Error creating post:', error); // Log the error for debugging
//     res.status(500).json({ error: 'Failed to create post', details: error.message });
//   }
// });

const express = require('express');
const router = express.Router();
const Post = require('../model/Postmodel');
const mongoose = require('mongoose');
const Notification = require('../model/notificationschema');
const User = require('../model/usermodel');
const { io } = require('../server'); // Importing io from server.js

// Get all posts with pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate('createdBy', 'name profilePicture')
      .populate('comments.createdBy', 'name profilePicture') // Populate comment creators
      .sort({ createdAt: -1 }) // Most recent first
      .skip(skip) // Skip posts based on page
      .limit(Number(limit)); // Limit the number of posts per page

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error); // Log the error for debugging
    res.status(500).json({ error: 'Failed to fetch posts', details: error.message });
  }
});

// Get posts by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ createdBy: userId })
      .populate('createdBy', 'name profilePicture')
      .populate('comments.createdBy', 'name profilePicture') // Populate comment creators
      .sort({ createdAt: -1 }); // Most recent first

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts by user ID:', error); // Log the error for debugging
    res.status(500).json({ error: 'Failed to fetch posts by user ID', details: error.message });
  }
});

// Create a new post
router.post('/', async (req, res) => {
  try {
    const { content, imageUrl, createdBy } = req.body;

    // Validate input
    if (!content || !createdBy) {
      return res.status(400).json({ error: 'Content and CreatedBy are required' });
    }

    if (imageUrl && !/^https?:\/\/.+$/.test(imageUrl)) {
      return res.status(400).json({ error: 'Invalid image URL' });
    }

    if (!mongoose.Types.ObjectId.isValid(createdBy)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const newPost = new Post({ content, imageUrl, createdBy });
    const savedPost = await newPost.save();

    // Create a notification for the new post
    const newNotification = new Notification({
      userId: createdBy,
      notification: 'A new post has been created!',
      date: new Date(),
    });

    await newNotification.save();

    // Emit a new notification to all connected clients
    io.emit('new_notification', newNotification);

    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post', details: error.message });
  }
});

// Like/Unlike a post
router.post('/like/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    console.log('Received like request for post:', postId, 'by user:', userId);

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.likes = post.likes || [];

    const isLiked = post.likes.includes(userId.toString());

    if (isLiked) {
      post.likes = post.likes.filter((id) => id !== userId.toString());
    } else {
      post.likes.push(userId.toString());
    }

    await post.save();

    res.json({ likes: post.likes.length, liked: !isLiked });
  } catch (error) {
    console.error('Error in like API:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add a comment to a post
router.post('/:postId/comment', async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, createdBy } = req.body;

    // Validate input
    if (!content || !createdBy) {
      return res.status(400).json({ error: 'Content and CreatedBy are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    if (!mongoose.Types.ObjectId.isValid(createdBy)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Add the new comment
    const newComment = { content, createdBy };
    post.comments.push(newComment);
    await post.save();

    // Populate the createdBy field in the new comment
    const populatedPost = await Post.findById(postId).populate('comments.createdBy', 'name profilePicture');
    const addedComment = populatedPost.comments.find(
      (comment) => comment.content === content && comment.createdBy._id.toString() === createdBy
    );

    // Create a notification for the new comment
    const newNotification = new Notification({
      userId: post.createdBy, // Notify the post creator
      notification: 'A new comment has been added to your post!',
      date: new Date(),
    });

    await newNotification.save();

    // Emit a new notification to all connected clients
    io.emit('new_notification', newNotification);

    // Return only the newly added comment
    res.status(201).json(addedComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment', details: error.message });
  }
});

router.get('/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    const post = await Post.findById(postId).populate('comments.createdBy', 'name profilePicture');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(post.comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments', details: error.message });
  }
});
module.exports = router;