const jwt = require('jsonwebtoken');
const secret = process.env.Secret_code; 

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Authorization denied, no token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {

    const decoded = jwt.verify(token, secret);
    

    req.user_id = decoded.user_id;
    req.email = decoded.email;  
    
    next(); 
  } catch (error) {
    console.log('Token verification failed:', error);
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
