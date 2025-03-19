import { Router } from 'express';
import { verifyToken, checkRole } from '@/middlewares/authorization.middleware';
import { SeedController } from '@/src/seed/seed.controller';

const router = Router();

// EndPoints
router.get("/", SeedController.dataSeed);

export default router;
