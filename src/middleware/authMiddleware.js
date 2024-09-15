const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = () => async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ status: 'fail', message: 'Access denied. No token provided.' });
  }

  try {
    const userData = jwt.verify(token, JWT_SECRET);
    req.user = userData;
    next();
  } catch (error) {
    res.status(403).json({ status: 'fail', message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
