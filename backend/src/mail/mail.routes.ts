import { Router } from 'express';
import { verifyToken, checkRole } from '@/middlewares/authorization.middleware';
import { MailController } from './mail.controller';

const router = Router();

// EndPoints
router.post("/resetPassword", MailController.resetPassword);

export default router;
