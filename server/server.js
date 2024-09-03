const express = require('express');
const app = express();
const { Server } = require('socket.io');
const http = require('http');
const { createOrUpdateChat } = require('./utility');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Your frontend URL
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('message', async (data) => {
    try {
      const { content, receiverId, senderId } = data;
      const message = {
        senderId,
        content,
        timestamp: new Date(),
      };

      // Save the message to the database
      const chat = await createOrUpdateChat(senderId, receiverId, message);

      // Emit the message to both sender and receiver
      io.to(receiverId).emit('message', message);
      io.to(senderId).emit('message', message);
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(9999, () => {
  console.log('Server is running on port 9999');
});
