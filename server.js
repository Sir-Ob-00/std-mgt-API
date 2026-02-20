import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import studentRoutes from './routes/studentRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors'; // optional if frontend is separate

// ---------------- CONFIG ----------------
dotenv.config();

const app = express();

// ---------------- MIDDLEWARE ----------------
app.use(express.json());
app.use(cors()); // allow cross-origin requests (if frontend hosted elsewhere)

// ---------------- STATIC FILES ----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

// Content Security Policy
app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'"
    );
    next();
});

// ---------------- API ROUTES ----------------
app.use('/api/students', studentRoutes); // API must come BEFORE catch-all

// ---------------- CATCH-ALL ROUTE ----------------
// Serve frontend for any other request (for SPA routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ---------------- DATABASE + SERVER ----------------
const PORT = process.env.PORT || 5000;
const MONGOURL = process.env.MONGO_URL || "mongodb://localhost:27017/school";

const startServer = async () => {
    try {
        await connectDB(MONGOURL);
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();