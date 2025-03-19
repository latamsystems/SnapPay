import { Router } from 'express';
import { verifyToken, checkRole } from '@/middlewares/authorization.middleware';
import crudRoutes from '@/lib/crud/routes/crud.routes';
import { crud, UserController } from "@/src/core/user/user.controller";

const router = Router();

// EndPoints
router.put("/activate/:id", verifyToken, UserController.activateUser);
router.put("/deactivate/:id", verifyToken, UserController.deactivateUser);

router.put("/profile/:id", verifyToken, UserController.updateUserProfile)
router.put("/profile/password/:id", verifyToken, UserController.updatePasswordUser);

router.put("/reset/password/:id/:identification", verifyToken, UserController.resetPasswordUser);
router.put("/reset/passwordCodeVerify", UserController.resetPasswordUserTokenVerify);
router.put("/reset/passwordCode", UserController.resetPasswordUserToken);

router.use("/", verifyToken, crudRoutes(crud));  // CRUD

export default router;
