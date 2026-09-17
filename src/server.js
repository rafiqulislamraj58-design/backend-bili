import app from './app/app.js';
import { connectDB } from './config/db.js';
import env from './config/env.js';

const startServer = async () => {

  await connectDB();

  app.listen(env.port, () => {
    console.log(`BiblioDrop server is running on port: ${env.port}`);
  });
};

startServer();