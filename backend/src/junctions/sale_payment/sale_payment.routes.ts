
import { Router } from 'express';
import multer from 'multer';
import { verifyToken, checkRole } from '@/middlewares/authorization.middleware';
import crudRoutes from '@/lib/crud/routes/crud.routes';
import { crud, Sale_PaymentController } from "@/src/junctions/sale_payment/sale_payment.controller";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

// EndPoints
router.get('/', crud.getAll);
router.post('/', upload.single('media_payment'), crud.create);
router.put('/', verifyToken, upload.single('media_payment'), crud.update);
router.delete('/:id', crud.delete);

router.use("/", verifyToken, crudRoutes(crud)); // CRUD

export default router;
