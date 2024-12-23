import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authController from './controllers/authController.js';
import chatController from './controllers/chatController.js';
import quizController from './controllers/quizController.js';


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authController);
app.use('/ai',chatController)
app.use('/study',quizController)

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});