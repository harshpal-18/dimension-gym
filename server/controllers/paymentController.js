import crypto from 'crypto';
import Razorpay from 'razorpay';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
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
      receipt: `order_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        plan,
        planName: planDetails.name,
      },
    });

    // Save the order in DB
    await Payment.create({
      userId: req.user._id,
      razorpayOrderId: order.id,
      razorpayPaymentId: null,
      razorpaySignature: null,
      plan,
      amount: planDetails.amount,
      currency: 'INR',
      status: 'created',
    });

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

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    if (expectedSignature !== razorpay_signature) {
      payment.status = 'failed';
      await payment.save();
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Update payment record
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = 'paid';
    await payment.save();

    // Update user membership
    const planDuration = PLAN_PRICES[payment.plan].duration;
    const now = new Date();
    const user = await User.findById(payment.userId);

    let expiryDate;
    if (user.membershipExpiry && new Date(user.membershipExpiry) > now) {
      expiryDate = new Date(user.membershipExpiry);
      expiryDate.setDate(expiryDate.getDate() + planDuration);
    } else {
      expiryDate = new Date(now);
      expiryDate.setDate(expiryDate.getDate() + planDuration);
    }

    user.activePlan = payment.plan;
    user.membershipStart = now;
    user.membershipExpiry = expiryDate;
    await user.save();

    // Send confirmation email (non-blocking)
    sendPaymentEmail(user, payment).catch(() => {});

    res.json({
      success: true,
      message: 'Payment verified successfully',
      payment: {
        id: payment.razorpayPaymentId,
        plan: payment.plan,
        amount: payment.amount,
        status: payment.status,
      },
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
    const payments = await Payment.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ success: true, payments });
  } catch (error) {
    console.error('getPaymentHistory error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};