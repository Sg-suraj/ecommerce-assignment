import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser'; // <-- 1. IMPORT COOKIE PARSER
import userRoutes from './routes/userRoutes.js';
import itemRoutes from './routes/itemRoutes.js'; 

// Load Env Vars
dotenv.config();

// --- Database Connection ---
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
connectDB(); 

// Initialize Express App
const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // <-- 2. USE COOKIE PARSER

// --- API Routes ---
app.get('/api/test', (req, res) => {
  res.json({ message: 'Welcome to the E-Commerce API!' });
});

app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes); 


// --- Start Server ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running in development mode on http://localhost:${PORT}`);
});