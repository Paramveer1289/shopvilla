// Nodemailer Transporter Configuration
const nodemailer = require('nodemailer');

const hasCredentials =
  Boolean(process.env.EMAIL_USER) && Boolean(process.env.EMAIL_PASS);

const cleanUser = (process.env.EMAIL_USER || '').trim().replace(/['"]/g, '');
const cleanPass = (pass) => {
  if (!pass) return '';
  const trimmed = pass.trim().replace(/['"]/g, '');
  const words = trimmed.split(/\s+/);
  if (words.length > 1 && words[0].length === 16) {
    return words[0];
  }
  return trimmed.replace(/\s+/g, '');
};

let transporter;

if (hasCredentials) {
  const isGmail =
    !process.env.EMAIL_HOST ||
    process.env.EMAIL_HOST.includes('gmail') ||
    cleanUser.endsWith('@gmail.com');

  if (isGmail) {
    // Gmail service configuration with SSL port 465 for reliable cloud delivery (Render/Vercel)
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: cleanUser,
        pass: cleanPass(process.env.EMAIL_PASS),
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
        user: cleanUser,
        pass: cleanPass(process.env.EMAIL_PASS),
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
