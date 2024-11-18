const nodemailer = require("nodemailer");

const sendEmail = (email, token) => {
  const verificationLink = `http://localhost:3000/api/v1/auth/verify-email?token=${token}&email=${email}`;

  // Configure the transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "imhamzee@gmail.com", // Your email
      pass: process.env.APP_PASSWORD, // App-specific password
    },
  });

  // Email content
  const mailOptions = {
    from: "imhamzee@gmail.com",
    to: email,
    subject: "Verify Your Email - Welcome to [Your App NameChat Application]",
    text: `
Hi there,

Welcome to [Chat Application]!

We're excited to have you on board. To get started, please verify your email by clicking the link below:

${verificationLink}

If you didn’t create an account with us, you can safely ignore this email.

Best regards,  
The [Your App Name] Team
    `,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h2 style="color: #4CAF50;">Welcome to [Your App Name]!</h2>
        <p>Hi there,</p>
        <p>We're excited to have you on board! To start exploring all the features we offer, please verify your email address by clicking the button below:</p>
        <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>If the button above doesn’t work, you can also click the following link:</p>
        <p><a href="${verificationLink}" style="color: #4CAF50;">${verificationLink}</a></p>
        <hr style="margin: 20px 0;">
        <p>If you didn’t create an account with us, you can safely ignore this email.</p>
        <p>Best regards,</p>
        <p>The <strong>[Your App Name]</strong> Team</p>
        <footer style="margin-top: 20px; font-size: 12px; color: #777;">
          <p>[Your App Name], Inc.</p>
          <p>123 Your Address, City, Country</p>
          <p><a href="mailto:support@yourapp.com" style="color: #4CAF50;">support@yourapp.com</a></p>
        </footer>
      </div>
    `,
  };

  // Send the email
  return transporter.sendMail(mailOptions)
    
};

module.exports = { sendEmail };
