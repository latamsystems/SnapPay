
import { Router } from 'express';
import { verifyToken, checkRole } from '@/middlewares/authorization.middleware';
import crudRoutes from '@/lib/crud/routes/crud.routes';
import { crud, Sale_PaymentController } from "@/src/junctions/sale_payment/sale_payment.controller";

const router = Router();

// EndPoints
router.get('/', crud.getAll);
router.delete('/:id', crud.delete);

router.use("/", verifyToken, crudRoutes(crud)); // CRUD

export default router;
