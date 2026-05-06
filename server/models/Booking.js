import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: {
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
    type: String,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
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

bookingSchema.index({ userId: 1, date: 1, timeSlot: 1 });
bookingSchema.index({ type: 1, date: 1, timeSlot: 1 });

export default mongoose.model('Booking', bookingSchema);