
import { Router } from 'express';
import { verifyToken, checkRole } from '@/middlewares/authorization.middleware';
import crudRoutes from '@/lib/crud/routes/crud.routes';
import { crud, SaleController } from "@/src/core/sale/sale.controller";

const router = Router();

// EndPoints
router.get('/firebase/:idf', SaleController.firebaseSale);
router.put('/sync', verifyToken, SaleController.syncSale);

router.use("/", verifyToken, crudRoutes(crud)); // CRUD

export default router;
