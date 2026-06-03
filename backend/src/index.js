import 'dotenv/config'; // Loads .env variables
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import vesselRoutes from './routes/vesselRoutes.js';
import voyageRoutes from './routes/voyageRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Configuration Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing Registrations
app.use('/api/auth', authRoutes);
app.use('/api/vessels', vesselRoutes);
app.use('/api/voyages', voyageRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api', reportRoutes);

// Root route for basic verification
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Vessel Optimization Platform Backend is online.' });
});

// Global Error handling middleware
app.use(errorHandler);

// Listen
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
