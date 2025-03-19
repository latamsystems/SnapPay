import { Request } from 'express';
import { AuthService } from "@/src/auth/auth.service";
import { Controller } from '@/lib/crud/controller/decorator.controller';

// =============================================================================

export class AuthController {

  /**
   * Autenticación
   * @param req
   */
  @Controller({
    service: AuthService.authenticateUser,
    messages: {
      success: 'Se ha conectado el usuario:',
      incorrectCredentials: 'Usuario o contraseña incorrectos.',
      inactiveAccount: 'El usuario esta inactivo.',
    },
    extractParams: (req: Request) => [req.body]
  })
  static authenticateUser() { void 0 }

  // =============================================================================

  /**
   * Obtener datos de usuario
   * @param req
   */
  @Controller({
    service: AuthService.getUserDetails,
    messages: {
      success: 'Detalles del usuario obtenidos correctamente.',
      forbidden: 'Usuario no autenticado.'
    },
    extractParams: (req: Request) => [req]
  })
  static getUserDetails() { void 0 }

  // =============================================================================

  /**
   * Cerrar sesión
   * @param req
   */
  @Controller({
    service: AuthService.logoutUser,
    messages: {
      success: 'Sesión cerrada correctamente.'
    },
    extractParams: (req: Request) => [req.headers.authorization]
  })
  static logoutUser() { void 0 }

  // =============================================================================

  @Controller({
    service: AuthService.renewToken,
    messages: {
      success: 'Token renovado correctamente.'
    },
    extractParams: (req: Request) => [req.headers.authorization]
  })
  static renewToken() { void 0 }

}