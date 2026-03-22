const nodemailer = require('nodemailer');

const EDU_DOMAINS = ['.edu', '.ac.uk', '.edu.in', '.edu.au', '.ac.in', '.edu.sg', '.edu.ca'];

const isEduEmail = (email) => {
  if (!email) return false;
  const lower = email.toLowerCase();
  return EDU_DOMAINS.some((domain) => lower.endsWith(domain));
};

const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Linx Platform" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your Linx account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Welcome to Linx!</h2>
        <p>Thanks for signing up. Please verify your email address to get started.</p>
        <a href="${verifyUrl}" style="
          display: inline-block;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          margin: 20px 0;
        ">Verify Email</a>
        <p style="color: #666;">This link expires in 24 hours.</p>
        <p style="color: #999; font-size: 12px;">If you did not create a Linx account, please ignore this email.</p>
      </div>
    `,
  });
};

const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Linx Platform" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset your Linx password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Password Reset Request</h2>
        <p>You requested a password reset for your Linx account.</p>
        <a href="${resetUrl}" style="
          display: inline-block;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          margin: 20px 0;
        ">Reset Password</a>
        <p style="color: #666;">This link expires in 1 hour.</p>
        <p style="color: #999; font-size: 12px;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
      </div>
    `,
  });
};

module.exports = { isEduEmail, sendVerificationEmail, sendPasswordResetEmail };
