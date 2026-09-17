import dotenv from 'dotenv';
dotenv.config();

const env = {
  port: process.env.PORT || 5000,
  dbUser: process.env.DB_USER,
  dbPass: process.env.DB_PASS,
  jwtSecret: process.env.JWT_SECRET,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  nodeEnv: process.env.NODE_ENV || 'development',
};

export default env;