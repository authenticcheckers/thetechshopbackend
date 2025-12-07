import { Router } from 'express';
import { getProducts, getProductById, createProduct } from '../controllers/products';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authMiddleware, createProduct);

export default router;
