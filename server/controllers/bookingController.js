import { getDB, saveDB } from '../config/db.js';
import { generateId } from '../config/idgen.js';
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
    const db = getDB();

    // Get existing bookings for this date and type
    const existingBookings = db.data.bookings.filter(b =>
      b.type === type &&
      b.date === dateStr &&
      b.status !== 'cancelled'
    );

    // Calculate available slots
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
    const db = getDB();

    // Check slot availability
    const existingCount = db.data.bookings.filter(b =>
      b.type === type && b.date === dateStr && b.timeSlot === timeSlot && b.status !== 'cancelled'
    ).length;

    if (existingCount >= config.maxPerSlot) {
      return res.status(400).json({ success: false, message: 'This slot is fully booked' });
    }

    // Check if user already has a booking at this time
    const userExisting = db.data.bookings.find(b =>
      b.userId === req.user.id && b.date === dateStr && b.timeSlot === timeSlot && b.status !== 'cancelled'
    );

    if (userExisting) {
      return res.status(400).json({ success: false, message: 'You already have a booking at this time' });
    }

    const booking = {
      id: generateId(),
      userId: req.user.id,
      type,
      className,
      trainer: trainer || '',
      date: dateStr,
      timeSlot,
      status: 'confirmed',
      notes: notes || '',
      createdAt: new Date().toISOString(),
    };

    db.data.bookings.push(booking);
    await saveDB();

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
    const db = getDB();
    const bookings = db.data.bookings
      .filter(b => b.userId === req.user.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 50);
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
export const cancelBooking = async (req, res) => {
  try {
    const db = getDB();
    const booking = db.data.bookings.find(b => b.id === req.params.id && b.userId === req.user.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking already cancelled' });
    }

    booking.status = 'cancelled';
    await saveDB();
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
