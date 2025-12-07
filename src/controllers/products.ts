import { Request, Response } from 'express';
import pool from '../utils/db';

export const getProducts = async (req: Request, res: Response) => {
  const products = await pool.query('SELECT * FROM products');
  res.json(products.rows);
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await pool.query('SELECT * FROM products WHERE id=$1', [id]);
  res.json(product.rows[0]);
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, price, description, specs, image } = req.body;
  const product = await pool.query(
    'INSERT INTO products (name,price,description,specs,image) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [name, price, description, specs, image]
  );
  res.json(product.rows[0]);
};
