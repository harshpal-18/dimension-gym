import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['personal-training', 'group-class'],
    required: true,
  },
  className: {
    type: String,
    required: true,
    trim: true,
  },
  trainer: {
    type: String,
    default: '',
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true, // e.g. "09:00-10:00"
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed',
  },
  notes: {
    type: String,
    default: '',
    maxlength: 500,
  },
}, {
  timestamps: true,
});

// Prevent double booking: same user, date, and time slot
bookingSchema.index({ user: 1, date: 1, timeSlot: 1 }, { unique: true });

// Prevent slot overflow: same type, date, timeSlot (limit checked in controller)
bookingSchema.index({ type: 1, date: 1, timeSlot: 1 });

export default mongoose.model('Booking', bookingSchema);
