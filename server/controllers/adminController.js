import User from '../models/User.js';
import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
export const getStats = async (req, res) => {
  try {
    const now = new Date();

    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeMembers = await User.countDocuments({ role: 'user', membershipExpiry: { $gt: now } });
    const paidPayments = await Payment.find({ status: 'paid' });
    const totalPayments = paidPayments.length;
    const totalRevenue = paidPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalBookings = await Booking.countDocuments({ status: 'confirmed' });

    const planDistribution = await User.aggregate([
      { $match: { role: 'user', activePlan: { $ne: 'none' } } },
      { $group: { _id: '$activePlan', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      stats: { totalUsers, activeMembers, totalPayments, totalRevenue, totalBookings, planDistribution },
    });
  } catch (error) {
    console.error('getStats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const total = await User.countDocuments({ role: 'user' });
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ success: true, users, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('getUsers error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all payments
// @route   GET /api/admin/payments
export const getPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const total = await Payment.countDocuments();
    const payments = await Payment.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ success: true, payments, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('getPayments error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all bookings
// @route   GET /api/admin/bookings
export const getBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const total = await Booking.countDocuments();
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ success: true, bookings, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('getBookings error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update user membership (admin)
// @route   PUT /api/admin/users/:id/membership
export const updateUserMembership = async (req, res) => {
  try {
    const { activePlan, durationDays } = req.body;

    const now = new Date();
    const expiry = new Date(now);
    expiry.setDate(expiry.getDate() + (durationDays || 30));

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        activePlan: activePlan || 'none',
        membershipStart: activePlan !== 'none' ? now : null,
        membershipExpiry: activePlan !== 'none' ? expiry : null,
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('updateUserMembership error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({ success: true, user: safeUser });
  } catch (error) {
    console.error('toggleUserStatus error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};