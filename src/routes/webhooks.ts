import { Router } from 'express';
import { paystackWebhook } from '../controllers/webhooks';

const router = Router();
router.post('/paystack', paystackWebhook);

export default router;
