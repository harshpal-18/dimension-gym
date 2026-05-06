import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  razorpayOrderId: {
    type: String,
    required: true,
  },
  razorpayPaymentId: {
    type: String,
    default: null,
  },
  razorpaySignature: {
    type: String,
    default: null,
  },
  plan: {
    type: String,
    enum: ['basic', 'standard', 'premium'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  status: {
    type: String,
    enum: ['created', 'paid', 'failed', 'refunded'],
    default: 'created',
  },
  paymentMethod: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

paymentSchema.index({ razorpayOrderId: 1 }, { unique: true });

export default mongoose.model('Payment', paymentSchema);