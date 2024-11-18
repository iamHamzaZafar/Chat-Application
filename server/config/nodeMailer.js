const nodemailer = require("nodemailer");

const sendEmail = (email, token) => {
  const verificationLink = `http://your-backend.com/verify-email?token=${token}&email=${email}`;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "imhamzee@gmail.com",
      pass: process.env.APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: "imhamzee@gmail.com",
    to: email,
    subject: "Verify Your Email",
    text: `Click the link to verify your email: ${verificationLink}`,
    html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
  };
  return transporter.sendMail(mailOptions);
};
