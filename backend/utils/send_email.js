import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import dotenv from "dotenv";

dotenv.config();

const sendEmail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_SMTP_HOST,
    port: Number(process.env.MAIL_SMTP_PORT),
    auth: {
      user: process.env.MAIL_SMTP_USER,
      pass: process.env.MAIL_SMTP_PASS,
    },
  });
    const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Job Portal",
      link: "https://jobportal.com",
    },
  });

  const emailBody = {
    body: {
      name: "User",
      intro: text,
      outro: "If you did not request this, ignore the email.",
    },
  };

  const html = mailGenerator.generate(emailBody);
  const plain = mailGenerator.generatePlaintext(emailBody);

  return transporter.sendMail({
    from: process.env.MAIL_SMTP_USER,
    to,
    subject,
    text: plain,
    html,
  });
};

export default sendEmail;