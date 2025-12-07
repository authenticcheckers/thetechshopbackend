import { Router } from 'express';
import { createOrder } from '../controllers/orders';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
router.post('/', createOrder);

export default router;
