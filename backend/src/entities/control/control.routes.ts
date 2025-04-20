
import { Router } from 'express';
import { verifyToken, checkRole } from '@/middlewares/authorization.middleware';
import crudRoutes from '@/lib/crud/routes/crud.routes';
import { crud, ControlController } from "@/src/entities/control/control.controller";

const router = Router();

// EndPoints
router.get("/", crud.getAll);
router.get("/:id", crud.getById);
router.put("/update/:id/:status", verifyToken, ControlController.updateControl);

router.use("/", verifyToken, checkRole([1]), crudRoutes(crud)); // CRUD

export default router;
