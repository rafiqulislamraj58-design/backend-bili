import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import env from '../config/env.js';

// Route Imports
import authRoutes from '../routes/auth.routes.js';
import bookRoutes from '../routes/book.routes.js';
import deliveryRoutes from '../routes/delivery.routes.js';
import reviewRoutes from '../routes/review.routes.js';
import statsRoutes from '../routes/stats.routes.js';
import userRoutes from '../routes/user.routes.js';
import wishlistRoutes from '../routes/wishlist.routes.js';

import { apiLimiter, authLimiter } from '../middleware/security.middleware.js';

const app = express();

app.use(helmet());
app.use('/api', apiLimiter);

app.use(
  cors({
    origin: [env.clientUrl],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'BiblioDrop Server running smoothly in production mode',
  });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wishlist', wishlistRoutes);


app.use((req, res) => {
  res.status(404).json({ message: 'Requested Route Not Found' });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

export default app;