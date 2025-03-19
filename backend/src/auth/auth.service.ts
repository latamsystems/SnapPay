import { TIME_SESION, TOKEN_SECRET } from '@/src/enviroment';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import HttpResponse from '@/helpers/httpResponse';

import models from '@/models/init-models';
import { rule, validateRequest } from '@/lib/crud/config/validation/request.validation';
import { Service } from '@/lib/crud/service/decorator.service';
import { UserModel } from '@/models/interface/user.interface';

// Tiempo de sesion
const DEFAULT_EXPIRATION_SECONDS = `${TIME_SESION}h`;

// =============================================================================

// Lista de tokens revocados
let revokedTokens: any = [];

/**
 * Revocar un token
 * @param {String} token 
*/
const revokeToken = (token: string) => {
  revokedTokens.push(token);
};

/**
 * Verificar si un token está revocado
 * @param {String} token 
 * @returns 
 */
export const isTokenRevoked = (token: string) => {
  return revokedTokens.includes(token);
};

// =============================================================================

export class AuthService {

  /**
   * Autenticación
   * @param formData 
   * @param reqMsg 
   * @returns 
   */
  @Service
  static async authenticateUser(formData: UserModel, reqMsg: Record<string, string>) {

    // Reglas de validación
    await validateRequest({
      model: models.User,
      formData,
      rules: [
        rule.validateFieldTypes(),
        rule.requiredFields(['email_user', 'password_user']),
        rule.validEmail('email_user'),
      ],
    });

    const { email_user, password_user } = formData;

    // Validar existencia
    const user = await models.User.findOne({ where: { email_user } });
    if (!user || !(await bcrypt.compare(password_user, user.password_user))) return HttpResponse.notFound({ message: reqMsg.incorrectCredentials, field: "email_user, password_user" });

    // Validar estado
    if (user.id_status === 2) return HttpResponse.forbidden(reqMsg.inactiveAccount);

    // Obtener solo la primera palabra del nombre y apellido
    const firstname = user.firstname_user.split(' ')[0];
    const lastname = user.lastname_user.split(' ')[0];

    // Generar el token JWT
    const token = jwt.sign({
      id_user: user.id_user,
      firstname_user: firstname,
      lastname_user: lastname,
      id_role: user.id_role,
    }, TOKEN_SECRET, { expiresIn: DEFAULT_EXPIRATION_SECONDS });

    return HttpResponse.success(`${reqMsg.success} ${user.email_user}`, { token });
  }

  // =============================================================================

  /**
   * Obtener detalles del usuario
   * @param data 
   * @param reqMsg 
   * @returns 
   */
  @Service
  static async getUserDetails(data: any, reqMsg: Record<string, string>) {
    // Verifica si el usuario está autenticado
    if (!data) return HttpResponse.forbidden(reqMsg.forbidden);

    // Los datos del usuario decodificados están disponibles
    const { id_user, firstname_user, lastname_user, id_role } = data.user;

    // El campo 'exp' contiene la fecha de expiración en formato de timestamp de Unix (segundos desde el epoch)
    const exp = data.exp;

    // Devuelve los detalles del usuario
    return HttpResponse.success(reqMsg.success, { id_user, firstname_user, lastname_user, id_role, exp });
  }

  // =============================================================================

  /**
   * Desautenticar un token
   * @param authorization 
   * @param reqMsg 
   * @returns 
   */
  @Service
  static async logoutUser(authorization: any, reqMsg: Record<string, string>) {
    const token = authorization.split(' ')[1];

    // Verificar si el token ya está revocado
    if (!isTokenRevoked(token)) {

      // Revocar el token
      revokeToken(token);
    }

    return HttpResponse.success(reqMsg.success);
  }

  // =============================================================================

  /**
   * Renovar token
   * @param authorization 
   * @param reqMsg 
   * @returns 
   */
  @Service
  static async renewToken(authorization: any, reqMsg: Record<string, string>) {
    const oldToken = authorization.split(' ')[1];

    // Verificar el token antiguo y extraer la información del usuario
    const decoded: any = jwt.verify(oldToken, TOKEN_SECRET);

    // Generar un nuevo token con la misma información del usuario pero con una nueva fecha de expiración
    const newToken: any = jwt.sign({
      id_user: decoded.id_user,
      firstname_user: decoded.firstname_user,
      lastname_user: decoded.lastname_user,
      id_role: decoded.id_role,
    }, TOKEN_SECRET, { expiresIn: DEFAULT_EXPIRATION_SECONDS });

    // Revocar el token antiguo
    revokeToken(oldToken);

    return HttpResponse.success(reqMsg.success, { token: newToken });
  }
}


