const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Message = require('../model/messagemodel');

// GET endpoint to fetch messages
router.get('/api/messages', async (req, res) => {
  const { userId, targetUserId } = req.query;
  console.log(`Fetching messages between userId: ${userId} and targetUserId: ${targetUserId}`);

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: targetUserId },
        { sender: targetUserId, receiver: userId },
      ],
    }).sort({ createdAt: 1 }); // Sort messages by createdAt in ascending order

    console.log(`Fetched ${messages.length} messages`);
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Error fetching messages" });
  }
});

// POST endpoint to save a new message
router.post('/api/messages', async (req, res) => {
  const { senderId, receiverId, content, audioURL } = req.body;

  console.log("Received new message data:");
  console.log(`Sender ID: ${senderId}`);
  console.log(`Receiver ID: ${receiverId}`);
  console.log(`Content: ${content}`);
  console.log(`Audio URL: ${audioURL}`);

  try {
    console.log("Audio URL:", audioURL); // Log the audio URL
    const isAudioMessage = audioURL && audioURL.trim() !== ""; // Check if audioURL is not empty
    const newMessage = new Message({
      
      sender: senderId,
      receiver: receiverId,
      content,
      audioURL, // If no audioURL is provided, it will default to ""
      isAudioMessage: isAudioMessage, // Use the updated flag logic
    });

    console.log("Saving the following message to the database:"); 
    console.log(newMessage);

    await newMessage.save(); // Save the new message in the database

    console.log("Message saved successfully");
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ message: "Error saving message" });
  }
});

module.exports = router;
