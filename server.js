import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import studentRoutes from './routes/studentRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';

// ---------------- CONFIG ----------------
dotenv.config();

const app = express();

// ---------------- MIDDLEWARE ----------------
app.use(express.json());

// ---------------- STATIC FILES ----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

// ---------------- API ROUTES ----------------
app.use('/api/students', studentRoutes);

// ---------------- CATCH-ALL ROUTE ----------------
// Serve frontend for any non-API route (SPA)
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ---------------- DATABASE + SERVER ----------------
const PORT = process.env.PORT || 4000;
const MONGOURL = process.env.MONGO_URL || 'mongodb://localhost:27017/school';

const startServer = async () => {
    try {
        await connectDB(MONGOURL);
        console.log('Database connected successfully');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();