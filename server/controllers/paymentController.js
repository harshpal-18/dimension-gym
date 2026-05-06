import crypto from 'crypto';
import Razorpay from 'razorpay';
import { getDB, saveDB } from '../config/db.js';
import { generateId } from '../config/idgen.js';
import { sendPaymentEmail } from '../services/emailService.js';

// Plan pricing (in paise for Razorpay — ₹ * 100)
const PLAN_PRICES = {
  basic: { amount: 2900, name: 'Basic Plan', duration: 30 },
  standard: { amount: 5900, name: 'Standard Plan', duration: 30 },
  premium: { amount: 9900, name: 'Premium Plan', duration: 30 },
};

// Initialize Razorpay
const getRazorpay = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
export const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!PLAN_PRICES[plan]) {
      return res.status(400).json({ success: false, message: 'Invalid plan selected' });
    }

    const planDetails = PLAN_PRICES[plan];
    const razorpay = getRazorpay();

    const order = await razorpay.orders.create({
      amount: planDetails.amount,
      currency: 'INR',
      receipt: `order_${req.user.id}_${Date.now()}`,
      notes: {
        userId: req.user.id,
        plan: plan,
        planName: planDetails.name,
      },
    });

    // Save the order in DB
    const db = getDB();
    db.data.payments.push({
      id: generateId(),
      userId: req.user.id,
      razorpayOrderId: order.id,
      razorpayPaymentId: null,
      razorpaySignature: null,
      plan,
      amount: planDetails.amount,
      currency: 'INR',
      status: 'created',
      createdAt: new Date().toISOString(),
    });
    await saveDB();

    res.json({
      success: true,
      order: { id: order.id, amount: order.amount, currency: order.currency },
      key: process.env.RAZORPAY_KEY_ID,
      user: { name: req.user.name, email: req.user.email, phone: req.user.phone },
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment order' });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payment/verify
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const db = getDB();

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const payment = db.data.payments.find(p => p.razorpayOrderId === razorpay_order_id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    if (expectedSignature !== razorpay_signature) {
      payment.status = 'failed';
      await saveDB();
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Update payment record
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = 'paid';

    // Update user membership
    const planDuration = PLAN_PRICES[payment.plan].duration;
    const now = new Date();
    const user = db.data.users.find(u => u.id === payment.userId);

    let expiryDate;
    if (user.membershipExpiry && new Date(user.membershipExpiry) > now) {
      expiryDate = new Date(user.membershipExpiry);
      expiryDate.setDate(expiryDate.getDate() + planDuration);
    } else {
      expiryDate = new Date(now);
      expiryDate.setDate(expiryDate.getDate() + planDuration);
    }

    user.activePlan = payment.plan;
    user.membershipStart = now.toISOString();
    user.membershipExpiry = expiryDate.toISOString();
    await saveDB();

    // Send confirmation email (non-blocking)
    sendPaymentEmail(user, payment).catch(() => {});

    res.json({
      success: true,
      message: 'Payment verified successfully',
      payment: { id: payment.razorpayPaymentId, plan: payment.plan, amount: payment.amount, status: payment.status },
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
};

// @desc    Get user's payment history
// @route   GET /api/payment/history
export const getPaymentHistory = async (req, res) => {
  try {
    const db = getDB();
    const payments = db.data.payments
      .filter(p => p.userId === req.user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
