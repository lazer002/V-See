const mongoose = require('mongoose');

let userschema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  user_role: {
    type: String,
    required: true,
    default: false
  },
  user_id: {
    type: String,
    required: true,
    unique: true
  },
  Profile: {
    type: String,
    default:''
  },
  friend_requests: [{
    from_user: {
      type:String,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  }]
});

let User = mongoose.model('User', userschema);

module.exports = User;
