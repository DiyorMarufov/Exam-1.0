import nodemailer from "nodemailer";

export const sendEmail = async (email, title, otpCode) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      secure: true,
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: title,
      text: otpCode,
    });
    console.log(info);
  } catch (error) {
    console.error(`Error in sending email:`, error.message);
  }
};
