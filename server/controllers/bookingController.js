import Booking from '../models/Booking.js';
import { sendBookingEmail } from '../services/emailService.js';

// Available slots configuration
const AVAILABLE_SLOTS = {
  'personal-training': {
    slots: ['06:00-07:00', '07:00-08:00', '08:00-09:00', '09:00-10:00', '10:00-11:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '18:00-19:00'],
    maxPerSlot: 1,
    classes: ['Strength Training', 'Weight Loss Program', 'Body Transformation', 'Flexibility & Mobility'],
    trainers: ['Marcus Kane', 'Sarah Chen', 'David Reeves'],
  },
  'group-class': {
    slots: ['06:00-07:00', '07:00-08:00', '09:00-10:00', '10:00-11:00', '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00'],
    maxPerSlot: 15,
    classes: ['CrossFit WOD', 'HIIT Blast', 'Cardio Kickboxing', 'Yoga Flow', 'Spin Class', 'Functional Training'],
    trainers: ['Marcus Kane', 'Sarah Chen', 'David Reeves'],
  },
};

// @desc    Get available slots for a date
// @route   GET /api/bookings/slots?type=xxx&date=xxx
export const getAvailableSlots = async (req, res) => {
  try {
    const { type, date } = req.query;
    if (!type || !date || !AVAILABLE_SLOTS[type]) {
      return res.status(400).json({ success: false, message: 'Invalid type or date' });
    }

    const config = AVAILABLE_SLOTS[type];
    const dateStr = new Date(date).toISOString().split('T')[0];

    const existingBookings = await Booking.find({
      type,
      date: dateStr,
      status: { $ne: 'cancelled' },
    });

    const slots = config.slots.map((slot) => {
      const bookingsInSlot = existingBookings.filter((b) => b.timeSlot === slot).length;
      return {
        time: slot,
        available: bookingsInSlot < config.maxPerSlot,
        remaining: config.maxPerSlot - bookingsInSlot,
      };
    });

    res.json({ success: true, slots, classes: config.classes, trainers: config.trainers });
  } catch (error) {
    console.error('getAvailableSlots error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create a booking
// @route   POST /api/bookings
export const createBooking = async (req, res) => {
  try {
    const { type, className, trainer, date, timeSlot, notes } = req.body;

    if (!AVAILABLE_SLOTS[type]) {
      return res.status(400).json({ success: false, message: 'Invalid booking type' });
    }

    const config = AVAILABLE_SLOTS[type];
    if (!config.slots.includes(timeSlot)) {
      return res.status(400).json({ success: false, message: 'Invalid time slot' });
    }

    const dateStr = new Date(date).toISOString().split('T')[0];

    // Check slot availability
    const existingCount = await Booking.countDocuments({
      type,
      date: dateStr,
      timeSlot,
      status: { $ne: 'cancelled' },
    });

    if (existingCount >= config.maxPerSlot) {
      return res.status(400).json({ success: false, message: 'This slot is fully booked' });
    }

    // Check if user already has a booking at this time
    const userExisting = await Booking.findOne({
      userId: req.user._id,
      date: dateStr,
      timeSlot,
      status: { $ne: 'cancelled' },
    });

    if (userExisting) {
      return res.status(400).json({ success: false, message: 'You already have a booking at this time' });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      type,
      className,
      trainer: trainer || '',
      date: dateStr,
      timeSlot,
      status: 'confirmed',
      notes: notes || '',
    });

    // Send confirmation email (non-blocking)
    sendBookingEmail(req.user, booking).catch(() => {});

    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(50);
    res.json({ success: true, bookings });
  } catch (error) {
    console.error('getMyBookings error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ success: true, booking });
  } catch (error) {
    console.error('cancelBooking error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};