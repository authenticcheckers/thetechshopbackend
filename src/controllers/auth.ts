import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../utils/db';

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await pool.query(
    'INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING id,name,email',
    [name,email,hashed]
  );
  res.json(user.rows[0]);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userRes = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  const user = userRes.rows[0];
  if (!user) return res.status(400).json({ message: 'User not found' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: 'Invalid password' });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
};
