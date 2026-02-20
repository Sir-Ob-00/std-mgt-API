import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import studentRoutes from './routes/studentRoute.js';

// Load environment variables from .env file
dotenv.config();

// express app initialization
const app = express();

//handle middleware
app.use(express.json());

// Routes
app.use('/api/students', studentRoutes);

// Connect to MongoDB and start the server
const PORT = process.env.PORT || 5000; 
const MONGOURL = process.env.MONGO_URL || "mongodb://localhost:27017/school";

const startServer = async () => {
    await connectDB(MONGOURL); 
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer(); // <-- this is the last call in the file

