const express = require('express')
const app = express()
const router = express.Router()
const passport = require('passport')
const User = require('../model/Signup')
const message = require('../model/message')
const Chat = require('../model/chat')
const jweb = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const multer = require('multer')
const secret = "fjwanfnwaifniwanfkwnighwignkqngiknakngiwangi3nkngwkangihaignqknguwangu3ahu3nq"
const { createOrUpdateChat } = require('../utility');

const authMiddleware = require('../auth/authMiddleware')



router.post('/signup', async (req, res) => {
  try {

    const { email, password, username } = req.body
    if (!email || !password || !username) {
      return res.json({ msg: ' bhar sb' })
    } else {

      bcrypt.hash(password, 12, async function (err, be) {

        const user_id = `user_${Math.floor(Math.random() * 1000000)}`

        const data = new User({ email, password: be, username, user_id,Profile:'' })
        const token = jweb.sign({ email: email }, secret)
        // console.log(token)
        await data.save()
        res.json({ token })
      })

    }
  } catch (error) {
    console.log(error)
  }
})

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body
    let data = await User.findOne({ email: email })
    if (!data) {
      console.log('data: ', data);
      return res.status(400).json({ msg: ' sahi se dal details' })
    }
    ismatch = await bcrypt.compare(password, data.password)

    if (ismatch) {
      const token = jweb.sign({ email: email, user_id: data.user_id }, secret, { expiresIn: '3d' })
      // console.log(token)
      return res.status(200).json({ token })
    } else {
      return res.status(400).json({ msg: ' sahi password pappu' })
    }

  } catch (error) {
    console.log(error)
  }
})











router.get('/getuser', authMiddleware, async (req, res) => {
  try {
    const users = await User.find({}); 

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});
router.post('/getmessage', authMiddleware, async (req, res) => {
  try {
    const userId = req.user_id;
    const receiverId = req.body.receiverId;

    const data = await Chat.find({
      $or: [
        { user1Id: userId, user2Id: receiverId },
        { user1Id: receiverId, user2Id: userId }
      ]
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/createChat', authMiddleware, async (req, res) => {
  try {
    const { content, receiverId } = req.body;
    const senderId = req.user_id;

    if (!content || !senderId || !receiverId) {
      return res.status(400).json({ msg: 'All fields are required.' });
    }

    const message = {
      senderId,
      content,
      timestamp: new Date(),
    };

    const chat = await createOrUpdateChat(senderId, receiverId, message);

    const io = req.app.get('socketio');
    io.to(receiverId).emit('message', message);
    io.to(senderId).emit('message', message);

    res.status(201).json({ msg: 'Chat created or updated successfully', chat });
  } catch (error) {
    console.error('Error: ', error);
    res.status(500).json({ msg: 'Server error' });
  }
});











router.post('/userProfile', async (req, res) => {
  try {

    const { userId } = req.body
    data = await User.findOne({ _id:userId })

    return res.status(200).json(data)

  } catch (error) {
    console.log('error: ', error);

  }
})


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/updateUser', upload.single('Profile'), async (req, res) => {
  try {
    const { userId, username, email } = req.body;
    const profileImage = req.file;

    const updateData = { username, email };

    if (profileImage) {
      
      updateData.Profile = profileImage.path; 
    }
    
    console.log('updateData:', updateData);

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(updatedUser);

  } catch (error) {
    console.log('Error:', error);
    return res.status(500).json({ error: 'An error occurred while updating user data' });
  }
});



module.exports = router


