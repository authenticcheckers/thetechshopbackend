import { Request, Response } from 'express';
import pool from '../utils/db';
import { sendOrderNotification } from '../utils/email';
import axios from 'axios';

export const createOrder = async (req: Request, res: Response) => {
  const { items, total, currency, email } = req.body;
  const userId = req.body.user_id || null;

  const orderRes = await pool.query(
    'INSERT INTO orders (user_id,status,total,currency) VALUES ($1,$2,$3,$4) RETURNING *',
    [userId,'pending',total,currency]
  );
  const order = orderRes.rows[0];

  for (const item of items) {
    await pool.query(
      'INSERT INTO order_items (order_id,product_id,quantity,price) VALUES ($1,$2,$3,$4)',
      [order.id,item.id,1,item.price]
    );
  }

  await sendOrderNotification({ ...order, email });

  // Paystack payment initialization
  const paystackRes = await axios.post('https://api.paystack.co/transaction/initialize', {
    amount: total * 100,
    email,
    currency
  }, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
  });

  res.json({ order, paystack: paystackRes.data });
};
