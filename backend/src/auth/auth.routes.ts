import { Router, Request, Response } from 'express';
import { verifyToken } from "@/middlewares/authorization.middleware";
import { getConnectedUsers } from '@/src/websocket';
import { AuthController } from '@/src/auth/auth.controller';

const router = Router();

// EndPoints

// Prueba de conexión del servidor
router.get('/ping', (req: Request, res: Response) => {
  res.status(200).send('pong');
});

// Usuarios conectados en la aplicación
router.get('/connected-users', (req: Request, res: Response) => {
  const connectedUsers = getConnectedUsers();
  res.json({ connectedUsers });
});

// Autenticación y manejo de usuarios
router.post('/login', AuthController.authenticateUser);
router.get('/userDetails', verifyToken, AuthController.getUserDetails);
router.get('/logout', verifyToken, AuthController.logoutUser);
router.get('/renewToken', verifyToken, AuthController.renewToken);

export default router;
