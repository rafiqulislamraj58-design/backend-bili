import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import { User } from '../models/User.model.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, env.jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
};

export const verifyAdmin = async (req, res, next) => {
  try {
    const email = req.user?.email;
    const user = await User.findOne({ email });

    if (user?.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access only' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyLibrarian = async (req, res, next) => {
  try {
    const email = req.user?.email;
    const user = await User.findOne({ email });

    if (user?.role !== 'librarian') {
      return res.status(403).json({ message: 'Forbidden: Librarian access only' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};