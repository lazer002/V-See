const Chat = require('./model/chat'); 

const createOrUpdateChat = async (user1Id, user2Id, message) => {
  try {
    if (!user1Id || !user2Id || !message.senderId) {
      throw new Error('user1Id, user2Id, and message.senderId are required');
    }

    let chat = await Chat.findOne({
      $or: [
        { user1Id, user2Id },
        { user1Id: user2Id, user2Id: user1Id }
      ]
    });

    if (!chat) {
      chat = new Chat({
        user1Id,
        user2Id,
        messages: [message],
      });
    } else {
      chat.messages.push(message);
    }

    await chat.save();
    return chat;
  } catch (error) {
    console.error('Error creating or updating chat:', error);
    throw error;
  }
};

module.exports = { createOrUpdateChat };
