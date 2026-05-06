import { getDB, saveDB } from '../config/db.js';

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
export const getStats = async (req, res) => {
  try {
    const db = getDB();
    const users = db.data.users.filter(u => u.role === 'user');
    const now = new Date();

    const totalUsers = users.length;
    const activeMembers = users.filter(u => u.membershipExpiry && new Date(u.membershipExpiry) > now).length;
    const paidPayments = db.data.payments.filter(p => p.status === 'paid');
    const totalPayments = paidPayments.length;
    const totalRevenue = paidPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalBookings = db.data.bookings.filter(b => b.status === 'confirmed').length;

    // Plan distribution
    const planCounts = {};
    users.filter(u => u.activePlan && u.activePlan !== 'none').forEach(u => {
      planCounts[u.activePlan] = (planCounts[u.activePlan] || 0) + 1;
    });
    const planDistribution = Object.entries(planCounts).map(([_id, count]) => ({ _id, count }));

    res.json({
      success: true,
      stats: { totalUsers, activeMembers, totalPayments, totalRevenue, totalBookings, planDistribution },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
export const getUsers = async (req, res) => {
  try {
    const db = getDB();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const allUsers = db.data.users
      .filter(u => u.role === 'user')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = allUsers.length;
    const users = allUsers.slice((page - 1) * limit, page * limit).map(u => {
      const { password, ...rest } = u;
      return rest;
    });

    res.json({ success: true, users, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all payments
// @route   GET /api/admin/payments
export const getPayments = async (req, res) => {
  try {
    const db = getDB();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const allPayments = [...db.data.payments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const total = allPayments.length;
    const payments = allPayments.slice((page - 1) * limit, page * limit).map(p => {
      const user = db.data.users.find(u => u.id === p.userId);
      return { ...p, user: user ? { name: user.name, email: user.email } : null };
    });

    res.json({ success: true, payments, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all bookings
// @route   GET /api/admin/bookings
export const getBookings = async (req, res) => {
  try {
    const db = getDB();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const allBookings = [...db.data.bookings].sort((a, b) => new Date(b.date) - new Date(a.date));
    const total = allBookings.length;
    const bookings = allBookings.slice((page - 1) * limit, page * limit).map(b => {
      const user = db.data.users.find(u => u.id === b.userId);
      return { ...b, user: user ? { name: user.name, email: user.email } : null };
    });

    res.json({ success: true, bookings, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update user membership (admin)
// @route   PUT /api/admin/users/:id/membership
export const updateUserMembership = async (req, res) => {
  try {
    const { activePlan, durationDays } = req.body;
    const db = getDB();
    const user = db.data.users.find(u => u.id === req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const now = new Date();
    const expiry = new Date(now);
    expiry.setDate(expiry.getDate() + (durationDays || 30));

    user.activePlan = activePlan || 'none';
    user.membershipStart = activePlan !== 'none' ? now.toISOString() : null;
    user.membershipExpiry = activePlan !== 'none' ? expiry.toISOString() : null;
    await saveDB();

    const { password, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle
export const toggleUserStatus = async (req, res) => {
  try {
    const db = getDB();
    const user = db.data.users.find(u => u.id === req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await saveDB();

    const { password, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
