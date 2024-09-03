const { Server } = require('socket.io');
const Chat = require('./model/chat'); // Adjust path as needed

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
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

        const chat = await createOrUpdateChat(senderId, receiverId, message);
        io.to(receiverId).emit('message', message); // Send message to receiver
        io.to(senderId).emit('message', message);   // Send message back to sender
      } catch (error) {
        console.error('Error handling message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { initializeSocket, getIO };
