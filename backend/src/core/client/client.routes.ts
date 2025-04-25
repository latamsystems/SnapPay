
import { Router } from 'express';
import { verifyToken, checkRole } from '@/middlewares/authorization.middleware';
import crudRoutes from '@/lib/crud/routes/crud.routes';
import { crud, ClientController } from "@/src/core/client/client.controller";

const router = Router();

// EndPoints
router.put("/activate/:id", verifyToken, ClientController.activateClient);
router.put("/deactivate/:id", verifyToken, ClientController.deactivateClient);

router.use("/", verifyToken, crudRoutes(crud)); // CRUD

export default router;
