const { Resend } = require('resend');
const Notification = require('../models/Notification');
const User = require('../models/User');

const resend = new Resend(process.env.RESEND_API_KEY);

// Sends an email via Resend. Failures are logged, never thrown — email issues shouldn't break the app's core flow.
const sendEmail = async (to, subject, htmlBody) => {
  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: htmlBody,
    });

    // Resend can return a response with an embedded `error` field instead of throwing
    if (response.error) {
      console.error('Email send error:', response.error.message);
      return { success: false, error: response.error.message };
    }

    return { success: true, result: response };
  } catch (error) {
    console.error('Email send error:', error.message);
    return { success: false, error: error.message };
  }
};

// Creates an in-app notification record
const createInAppNotification = async ({ userId, title, message, type, relatedDrive, relatedApplication }) => {
  return Notification.create({
    user: userId,
    title,
    message,
    type: type || 'general',
    relatedDrive,
    relatedApplication,
  });
};

// Combined helper: creates the in-app notification AND sends the email, for a given user
const notifyUser = async ({ userId, title, message, type, relatedDrive, relatedApplication }) => {
  const inAppNotification = await createInAppNotification({
    userId,
    title,
    message,
    type,
    relatedDrive,
    relatedApplication,
  });

  const user = await User.findById(userId);
  let emailResult = null;
  if (user?.email) {
    emailResult = await sendEmail(user.email, title, `<p>${message}</p>`);
  }

  return { inAppNotification, emailResult };
};

module.exports = { sendEmail, createInAppNotification, notifyUser };