import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mediqueue_super_secret_jwt_key_2026');

      // Get user from DB
      const user = await User.findOne({ uid: decoded.uid });
      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Automatically assign admin role to mdmahadih673@gmail.com
      if (user.email === 'mdmahadih673@gmail.com') {
        user.role = 'admin';
      } else {
        user.role = user.role || 'user';
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token validation failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};
