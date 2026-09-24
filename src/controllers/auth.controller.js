import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import { User } from '../models/User.model.js';

const cookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: env.nodeEnv === 'production' ? 'none' : 'strict',
};


export const createToken = async (req, res) => {
  try {
    const user = req.body;
    if (!user?.email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const token = jwt.sign(user, env.jwtSecret, { expiresIn: '7d' });
    res
      .cookie('token', token, cookieOptions)
      .status(200)
      .json({ success: true, message: 'Token set successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const clearToken = async (req, res) => {
  try {
    res
      .clearCookie('token', { ...cookieOptions, maxAge: 0 })
      .status(200)
      .json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const saveUser = async (req, res) => {
  try {
    const { name, email, photoURL, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({ message: 'User already exists', user: existingUser });
    }

    const newUser = await User.create({
      name,
      email,
      photoURL: photoURL || '',
      role: role || 'user',
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMe = async (req, res) => {
  try {
    const email = req.user?.email;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};