import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import env from '../config/env.js';
import authRoutes from '../routes/auth.routes.js';
import bookRoutes from '../routes/book.routes.js'; 

const app = express();

app.use(cors({
  origin: [env.clientUrl],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Root Route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'BiblioDrop Server running smoothly' });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes); 

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Requested Route Not Found' });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

export default app;