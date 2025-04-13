// utils/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = (to, subject, html) => {
  const mailOptions = {
    from: 'clubs@zetech.ac.ke',
    to,
    subject,
    html
  };

  return transporter.sendMail(mailOptions);
};

// Specific notification templates
module.exports = {
  sendJoinConfirmation: (email, clubName) => sendEmail(
    email,
    `🎉 Welcome to ${clubName}!`,
    `<h2>Club Membership Confirmed</h2>
     <p>You've successfully joined ${clubName}! Access your club dashboard to:</p>
     <ul>
       <li>View upcoming events</li>
       <li>Participate in discussions</li>
       <li>Connect with other members</li>
     </ul>`
  ),

  sendStatusUpdate: (email, clubName, status) => sendEmail(
    email,
    `Membership Update - ${clubName}`,
    `<p>Your membership request for <strong>${clubName}</strong> has been:</p>
     <h3 style="color: ${status === 'approved' ? '#4CAF50' : '#f44336'}">
       ${status.toUpperCase()}
     </h3>`
  )
};