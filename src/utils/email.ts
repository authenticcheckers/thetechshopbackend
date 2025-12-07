import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOrderNotification = async (order: any) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.NOTIFY_EMAIL,
    subject: `New Order: #${order.id}`,
    text: `You have a new order of ${order.total} ${process.env.CURRENCY}. Contact: ${order.email}`,
  };
  await transporter.sendMail(mailOptions);
};
