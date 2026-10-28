// Nodemailer Transporter Configuration
const nodemailer = require('nodemailer');

const hasCredentials =
  Boolean(process.env.EMAIL_USER) && Boolean(process.env.EMAIL_PASS);

let transporter;

if (hasCredentials) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
} else {
  // Mock transporter for development without active Gmail App Password
  transporter = {
    sendMail: async (mailOptions) => {
      console.log('\n================ [MOCK EMAIL SENT] ================');
      console.log(`To:      ${mailOptions.to}`);
      console.log(`Subject: ${mailOptions.subject}`);
      console.log(`Preview: ${mailOptions.text || mailOptions.html.replace(/<[^>]*>?/gm, '')}`);
      console.log('===================================================\n');
      return { messageId: `mock-${Date.now()}` };
    },
  };
}

module.exports = transporter;
