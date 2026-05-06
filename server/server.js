import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';
import User from './models/User.js';

import authRoutes from './routes/auth.js';
import paymentRoutes from './routes/payment.js';
import bookingRoutes from './routes/booking.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://dimension-gym.vercel.app',
    'https://dimension-gym-git-main-itsmeharshp0-4257s-projects.vercel.app',
    'https://dimension-6xnnkyqvb-itsmeharshp0-4257s-projects.vercel.app',
  ],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Seed admin user
const seedAdmin = async () => {
  try {
    const adminEmail = (
      process.env.ADMIN_EMAIL || 'admin@dimensiongym.com'
    ).toLowerCase();

    const existing = await User.findOne({ email: adminEmail });

    if (!existing) {
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'admin123456',
        role: 'admin',
        activePlan: 'premium',
        membershipStart: new Date(),
        membershipExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isActive: true,
      });
      console.log(`👑 Admin user created: ${adminEmail}`);
    } else {
      console.log(`👑 Admin already exists: ${adminEmail}`);
    }
  } catch (error) {
    console.error('❌ Admin seed error:', error);
  }
};

// Start server
const startServer = async () => {
  try {
    await initDB();
    await seedAdmin();

    app.listen(PORT, () => {
      console.log(`🔥 Dimension Gym API running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
  }
};

startServer();