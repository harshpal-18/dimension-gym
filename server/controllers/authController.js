import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import { getDB, saveDB } from '../config/db.js';
import { generateId } from '../config/idgen.js';
import { sendWelcomeEmail } from '../services/emailService.js';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// @desc    Register new user
// @route   POST /api/auth/signup
export const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { name, email, phone, password } = req.body;
    const db = getDB();

    // Check if user already exists
    const existingUser = db.data.users.find(u => u.email === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = {
      id: generateId(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || '',
      password: hashedPassword,
      role: 'user',
      activePlan: 'none',
      membershipStart: null,
      membershipExpiry: null,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    db.data.users.push(user);
    await saveDB();

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user).catch(() => {});

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        activePlan: user.activePlan,
        membershipStart: user.membershipStart,
        membershipExpiry: user.membershipExpiry,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Server error during signup' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const db = getDB();

    const user = db.data.users.find(u => u.email === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account has been deactivated' });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        activePlan: user.activePlan,
        membershipStart: user.membershipStart,
        membershipExpiry: user.membershipExpiry,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = req.user;
    const isMembershipActive = user.membershipExpiry ? new Date(user.membershipExpiry) > new Date() : false;

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        activePlan: user.activePlan,
        membershipStart: user.membershipStart,
        membershipExpiry: user.membershipExpiry,
        isMembershipActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const db = getDB();
    const user = db.data.users.find(u => u.id === req.user.id);

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    await saveDB();

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        activePlan: user.activePlan,
        membershipStart: user.membershipStart,
        membershipExpiry: user.membershipExpiry,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
