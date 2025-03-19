import { Router } from 'express';
import asyncHandler from './config.routes';

/**
 * Genera rutas CRUD automáticamente para una entidad dada
 * @param controller - Controlador con métodos estándar
 * @returns Router
 */
const crudRoutes = (controller: any) => {
    const router = Router();

    router.get("/", asyncHandler(controller.getAll));
    router.post("/", asyncHandler(controller.create));
    router.get("/:id", asyncHandler(controller.getById));
    router.put("/:id", asyncHandler(controller.update));
    router.delete("/:id", asyncHandler(controller.delete));
    router.put("/enable/:id", asyncHandler(controller.enable));

    return router;
};

export default crudRoutes;