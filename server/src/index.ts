import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

process.on('uncaughtException', (err: any) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message, err.stack);

  // By doing this we are giving the server time to run the remaining requests and gracefully shutdown
  process.exit(1);
});

import { userRouter } from './routes/userRoutes';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/users', userRouter);

//  - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

dotenv.config({ path: './config.env' });

const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(db).then((connection) => {
  console.log('Connection successful!');
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// unhandled rejections are errors that have to do with unresolved promises
process.on('unhandledRejection', (err: any) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);

  // By doing this we are giving the server time to run the remaining requests and gracefully shutdown
  server.close(() => {
    process.exit(1);
  });
});
