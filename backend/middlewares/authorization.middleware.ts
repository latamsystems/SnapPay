import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { TOKEN_SECRET } from '@/src/enviroment';

import Console from '@/helpers/console';
import ApiResponse from '@/helpers/apiResponse';

import { isTokenRevoked } from '@/src/auth/auth.service';

// Nombre de la verificación
const consoleHelper = new Console('Token Verify');

// Definir una interfaz para extender `Request` de Express
interface AuthenticatedRequest extends Request {
  user?: JwtPayload & { id_role?: number };
}

/**
 * Verificar token JWT
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Siguiente función en la cadena de middlewares
 */
export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      const infoMessage = 'No se recibió ningún token.';
      consoleHelper.info(infoMessage);
      new ApiResponse().handleErrorResponse(res, { code: 401, error: true, message: infoMessage });
      return;
    }

    // Remover "Bearer " del token antes de verificar
    const tokenWithoutBearer = token.split(' ')[1];

    if (isTokenRevoked(tokenWithoutBearer)) {
      const infoMessage = 'Token revocado';
      consoleHelper.info(infoMessage);
      new ApiResponse().handleErrorResponse(res, { code: 401, error: true, message: infoMessage });
      return;
    }

    // Verificar la validez del token
    const decoded = jwt.verify(tokenWithoutBearer, TOKEN_SECRET) as JwtPayload & { id_role?: number };
    req.user = decoded;

    consoleHelper.success(`Token válido para usuario ID: ${decoded.id_user}`);

    next();
  } catch (error: any) {
    const errorMessage = 'Token inválido';
    consoleHelper.error(errorMessage);
    new ApiResponse().handleErrorResponse(res, { code: 403, error: true, message: errorMessage });
    return;
  }
};

// =================================================================================================

/**
 * Verificar si el usuario tiene los roles necesarios
 * @param rolesPermitidos - Array de IDs de roles permitidos
 */
export const checkRole = (rolesPermitidos: number[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      const infoMessage = 'Usuario no autenticado';
      consoleHelper.info(infoMessage);
      new ApiResponse().handleErrorResponse(res, { code: 401, error: true, message: infoMessage });
      return;
    }

    const { id_role } = req.user;

    if (!id_role) {
      const infoMessage = 'No se encontró rol en el token';
      consoleHelper.info(infoMessage);
      new ApiResponse().handleErrorResponse(res, { code: 403, error: true, message: infoMessage });
      return;
    }

    if (!rolesPermitidos.includes(id_role)) {
      const infoMessage = 'Acceso denegado, rol insuficiente';
      consoleHelper.info(infoMessage);
      new ApiResponse().handleErrorResponse(res, { code: 403, error: true, message: infoMessage });
      return;
    }

    consoleHelper.success(`Acceso permitido para el rol: ${id_role}`);
    next();
  };
};

