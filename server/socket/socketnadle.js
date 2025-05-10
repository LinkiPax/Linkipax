const Room=require('../model/roommodel');

const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected at room: ${socket.id}`);

    // Join room
    socket.on('joinRoom', async ({ roomId, userId, username }) => {
      try {
        const room = await Room.findOne({ roomId });
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Add user to the room
        room.users.push({ userId, username });
        await room.save();

        socket.join(roomId);
        io.to(roomId).emit('userJoined', { userId, username, users: room.users });
        console.log(`User ${username} joined room ${roomId}`);
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Error joining room' });
      }
    });

    // Send a message
    socket.on('sendMessage', ({ roomId, userId, message }) => {
      io.to(roomId).emit('newMessage', { userId, message });
    });

    // Leave room
    socket.on('leaveRoom', async ({ roomId, userId }) => {
      try {
        const room = await Room.findOne({ roomId });
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Remove user from the room
        room.users = room.users.filter((user) => user.userId !== userId);
        await room.save();

        socket.leave(roomId);
        io.to(roomId).emit('userLeft', { userId, users: room.users });
        console.log(`User ${userId} left room ${roomId}`);
      } catch (error) {
        console.error('Error leaving room:', error);
        socket.emit('error', { message: 'Error leaving room' });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

module.exports = { initializeSocket };
