import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import studentRoutes from './routes/studentRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// ---------------- STATIC FILE SERVING ----------------

// Required for ES modules (__dirname replacement)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// CSP middleware
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'");
    next();
});

// ---------------- ROUTES ----------------
app.use('/api/students', studentRoutes);

// ---------------- DATABASE + SERVER ----------------

const PORT = process.env.PORT || 5000;
const MONGOURL = process.env.MONGO_URL || "mongodb://localhost:27017/school";

const startServer = async () => {
    await connectDB(MONGOURL);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();