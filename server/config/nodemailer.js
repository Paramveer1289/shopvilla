// Nodemailer Transporter Configuration
const nodemailer = require('nodemailer');

const hasCredentials =
  Boolean(process.env.EMAIL_USER) && Boolean(process.env.EMAIL_PASS);

let transporter;

if (hasCredentials) {
  const isGmail =
    !process.env.EMAIL_HOST ||
    process.env.EMAIL_HOST.includes('gmail') ||
    (process.env.EMAIL_USER && process.env.EMAIL_USER.endsWith('@gmail.com'));

  if (isGmail) {
    // Gmail service configuration with SSL port 465 for reliable cloud delivery (Render/Vercel)
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: (process.env.EMAIL_PASS || '').replace(/\s+/g, ''),
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
    });
  } else {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: (process.env.EMAIL_PASS || '').replace(/\s+/g, ''),
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
    });
  }
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
