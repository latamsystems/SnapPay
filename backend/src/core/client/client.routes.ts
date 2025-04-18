
import { Router } from 'express';
import { verifyToken, checkRole } from '@/middlewares/authorization.middleware';
import crudRoutes from '@/lib/crud/routes/crud.routes';
import { crud, ClientController } from "@/src/core/client/client.controller";

const router = Router();

// EndPoints
router.use("/", verifyToken, crudRoutes(crud)); // CRUD

export default router;
