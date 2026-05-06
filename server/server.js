import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import { initDB, getDB, saveDB } from './config/db.js';
import { generateId } from './config/idgen.js';

import authRoutes from './routes/auth.js';
import paymentRoutes from './routes/payment.js';
import bookingRoutes from './routes/booking.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
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
    const db = getDB();

    const adminEmail = (
      process.env.ADMIN_EMAIL ||
      'admin@dimensiongym.com'
    ).toLowerCase();

    const existing = db.data.users.find(
      (u) => u.email === adminEmail
    );

    if (!existing) {
      const salt = await bcrypt.genSalt(12);

      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || 'admin123456',
        salt
      );

      db.data.users.push({
        id: generateId(),
        name: 'Admin',
        email: adminEmail,
        phone: '',
        password: hashedPassword,
        role: 'admin',
        activePlan: 'premium',
        membershipStart: new Date().toISOString(),
        membershipExpiry: new Date(
          Date.now() + 365 * 24 * 60 * 60 * 1000
        ).toISOString(),
        isActive: true,
        createdAt: new Date().toISOString(),
      });

      await saveDB();

      console.log(`👑 Admin user created: ${adminEmail}`);
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
      console.log(
        `🌐 Client URL: ${
          process.env.CLIENT_URL || 'http://localhost:5173'
        }`
      );
    });
  } catch (error) {
    console.error('❌ Server startup failed:', error);
  }
};

startServer();