import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import env from '../config/env.js';
import authRoutes from '../routes/auth.routes.js'; 

const app = express();

// Middlewares
app.use(cors({
  origin: [env.clientUrl],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Base Route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'BiblioDrop Server is running smoothly!' });
});

// Auth Routes Mount
app.use('/api/auth', authRoutes); 

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Requested Route Not Found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

export default app;