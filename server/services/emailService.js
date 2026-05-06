import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Send email helper
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Dimension Gym" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error(`❌ Email error: ${error.message}`);
    return false; // Don't crash the app if email fails
  }
};

// Welcome email after signup
export const sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #ff1a1a, #cc0000); padding: 40px 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px;">DIMENSION GYM</h1>
        <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">Welcome to the team!</p>
      </div>
      <div style="padding: 30px;">
        <h2 style="color: #ff1a1a; margin-top: 0;">Hey ${user.name}! 💪</h2>
        <p style="color: #ccc; line-height: 1.6;">Welcome to Dimension Gym! Your account has been created successfully. You’re now part of the most elite fitness community.</p>
        <p style="color: #ccc; line-height: 1.6;">Choose a membership plan to unlock full access to our world-class facility, expert trainers, and exclusive programs.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}" style="background: linear-gradient(135deg, #ff1a1a, #cc0000); color: white; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-weight: 600;">Explore Plans</a>
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #222; padding-top: 20px;">© 2026 Dimension Gym. All rights reserved.</p>
      </div>
    </div>
  `;
  return sendEmail(user.email, 'Welcome to Dimension Gym! 🏋️', html);
};

// Payment success email
export const sendPaymentEmail = async (user, payment) => {
  const planNames = { basic: 'Basic', standard: 'Standard', premium: 'Premium' };
  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #ff1a1a, #cc0000); padding: 40px 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px;">DIMENSION GYM</h1>
        <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">Payment Confirmation</p>
      </div>
      <div style="padding: 30px;">
        <h2 style="color: #22c55e; margin-top: 0;">Payment Successful! ✅</h2>
        <p style="color: #ccc;">Hey ${user.name}, your payment has been confirmed.</p>
        <div style="background: #111; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <p style="color: #999; margin: 5px 0;"><strong style="color: #fff;">Plan:</strong> ${planNames[payment.plan]}</p>
          <p style="color: #999; margin: 5px 0;"><strong style="color: #fff;">Amount:</strong> ₹${payment.amount / 100}</p>
          <p style="color: #999; margin: 5px 0;"><strong style="color: #fff;">Payment ID:</strong> ${payment.razorpayPaymentId}</p>
          <p style="color: #999; margin: 5px 0;"><strong style="color: #fff;">Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #222; padding-top: 20px;">© 2026 Dimension Gym. All rights reserved.</p>
      </div>
    </div>
  `;
  return sendEmail(user.email, 'Payment Confirmed - Dimension Gym 💳', html);
};

// Booking confirmation email
export const sendBookingEmail = async (user, booking) => {
  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #ff1a1a, #cc0000); padding: 40px 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px;">DIMENSION GYM</h1>
        <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">Booking Confirmation</p>
      </div>
      <div style="padding: 30px;">
        <h2 style="color: #ff1a1a; margin-top: 0;">Booking Confirmed! 📅</h2>
        <p style="color: #ccc;">Hey ${user.name}, your session is booked.</p>
        <div style="background: #111; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <p style="color: #999; margin: 5px 0;"><strong style="color: #fff;">Class:</strong> ${booking.className}</p>
          <p style="color: #999; margin: 5px 0;"><strong style="color: #fff;">Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
          <p style="color: #999; margin: 5px 0;"><strong style="color: #fff;">Time:</strong> ${booking.timeSlot}</p>
          ${booking.trainer ? `<p style="color: #999; margin: 5px 0;"><strong style="color: #fff;">Trainer:</strong> ${booking.trainer}</p>` : ''}
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #222; padding-top: 20px;">© 2026 Dimension Gym. All rights reserved.</p>
      </div>
    </div>
  `;
  return sendEmail(user.email, 'Booking Confirmed - Dimension Gym 📅', html);
};
