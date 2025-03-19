
import { Router } from 'express';
import { verifyToken, checkRole } from '@/middlewares/authorization.middleware';
import crudRoutes from '@/lib/crud/routes/crud.routes';
import { crud, RoleController } from "@/src/entities/role/role.controller";

const router = Router();

// EndPoints
router.get("/", verifyToken, crud.getAll);
router.get("/:id", verifyToken, crud.getById);

router.use("/", verifyToken, checkRole([1]), crudRoutes(crud)); // CRUD

export default router;
