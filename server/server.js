const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const bodyparser = require('body-parser');
require('./db/connection.js');
const Chat = require('./model/chat.js'); 
const router = require('./router/router');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/', router);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinRoom', (room) => {
    socket.join(room);
  });

  socket.on('sendMessage', async (message) => {
    console.log('messagefwafwafwa: ', message);
    try {
    
      let chat = await Chat.findOne({
        $or: [
          { user1Id: message.senderId, user2Id: message.receiverId },
          { user1Id: message.receiverId, user2Id: message.senderId }
        ]
        
      });

      if (!chat) {
        chat = new Chat({
          user1Id: message.senderId,
          user2Id: message.receiverId,
          messages: [message],
        });
        
      } else {
        chat.messages.push(message);
      }

      await chat.save();

      io.to(message.receiverId).emit('receiveMessage', message);
      io.to(message.senderId).emit('receiveMessage', message); 
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(9999, () => {
  console.log('Server running on port 9999');
});
