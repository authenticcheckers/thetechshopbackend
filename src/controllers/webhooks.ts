import { Request, Response } from 'express';
import pool from '../utils/db';

export const paystackWebhook = async (req: Request, res: Response) => {
  const event = req.body;
  if (event.event === 'charge.success') {
    const ref = event.data.reference;
    await pool.query('UPDATE orders SET status=$1 WHERE id=$2', ['paid', ref]);
  }
  res.sendStatus(200);
};
