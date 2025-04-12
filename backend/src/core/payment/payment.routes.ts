
import { Router } from 'express';
import { verifyToken, checkRole } from '@/middlewares/authorization.middleware';
import crudRoutes from '@/lib/crud/routes/crud.routes';
import { crud, PaymentController } from "@/src/core/payment/payment.controller";

const router = Router();

// EndPoints
router.put('/status/:id', verifyToken, PaymentController.statusPayment);

router.use("/", verifyToken, crudRoutes(crud)); // CRUD

export default router;
