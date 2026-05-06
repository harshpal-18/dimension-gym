import mongoose from 'mongoose';

export async function initDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Atlas connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

export function getDB() {
  return mongoose.connection;
}

export async function saveDB() {
  // Not needed with MongoDB
}