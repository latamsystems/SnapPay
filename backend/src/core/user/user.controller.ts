import { Request, Response } from 'express';
import userService, { UserService } from "@/src/core/user/user.service";

import { handleController } from '@/lib/crud/controller/config.controller';
import { CrudController } from '@/lib/crud/controller/crud.controller';
import { Controller } from '@/lib/crud/controller/decorator.controller';

// =============================================================================
// =============================================================================

/**
 * Métodos personalizados del controlador
 */
const controllerMethods = {
    create: async (req: Request, res: Response) => handleController(
        req, res, userService.crud.create,
        {
            success: 'Registro creado exitosamente.',
            sameIdentification: 'Ya existe un usuario registrado con esa identificación.',
            sameEmail: 'Ya existe un usuario con ese correo eléctronico.',
        },
        [req.body],
    ),
    update: async (req: Request, res: Response) => handleController(
        req, res, userService.crud.update,
        {
            success: 'Registro actualizado exitosamente.',
            notFound: 'Registro no encontrado.',
            sameIdentification: 'Ya existe un usuario registrado con esa identificación.',
            sameEmail: 'Ya existe un usuario con ese correo eléctronico.',
        },
        [req.params.id, req.body],
    ),
}

// Exporta el CRUD con los métodos personalizados
export const crud = CrudController(userService.crud, controllerMethods);

// =============================================================================
// =============================================================================

export class UserController {

    /**
     * Actualizar perfil por ID
     * @param req
     */
    @Controller({
        service: UserService.updateUserProfile,
        messages: {
            success: "Perfil actualizado exitosamente.",
            notFound: "Usuario no encontrado.",
            sameIdentification: "Ya existe un usuario registrado con esa identificación.",
            sameEmail: "Ya existe un usuario con ese correo electrónico."
        },
        extractParams: (req: Request) => [req.params.id, req.body]
    })
    static updateUserProfile() { void 0 }

    // =============================================================================

    /**
     * Actualizar contraseña por ID
     * @param req
     */
    @Controller({
        service: UserService.updatePasswordUser,
        messages: {
            success: "Contraseña actualizada exitosamente.",
            notFound: "Usuario no encontrado."
        },
        extractParams: (req: Request) => [req.params.id, req.body]
    })
    static updatePasswordUser() { void 0 }

    // =============================================================================

    /**
     * Desactivar registro
     * @param req
     */
    @Controller({
        service: UserService.deactivateUser,
        messages: {
            success: "Registro desactivado exitosamente.",
            notFound: "Registro no encontrado."
        },
        extractParams: (req: Request) => [req.params.id]
    })
    static deactivateUser() { void 0 }

    // =============================================================================

    /**
     * Activar registro
     * @param req
     */
    @Controller({
        service: UserService.activateUser,
        messages: {
            success: "Registro activado exitosamente.",
            notFound: "Registro no encontrado."
        },
        extractParams: (req: Request) => [req.params.id]
    })
    static activateUser() { void 0 }

    // =============================================================================

    /**
     * Restablecer contraseña
     * @param req
     */
    @Controller({
        service: UserService.resetPasswordUser,
        messages: {
            success: "Contraseña restablecida exitosamente.",
            notFound: "Usuario no encontrado."
        },
        extractParams: (req: Request) => [req.params.id, req.params.identification]
    })
    static resetPasswordUser() { void 0 }

    // =============================================================================

    /**
     * Verificar código de restablecimiento de contraseña
     * @param req
     */
    @Controller({
        service: UserService.resetPasswordUserTokenVerify,
        messages: {
            success: "Codigo de restablecimiento verificado exitosamente.",
            notFoundCode: "Codigo de usuario no encontrado o expirado."
        },
        extractParams: (req: Request) => [req.body]
    })
    static resetPasswordUserTokenVerify() { void 0 }

    // =============================================================================

    /**
     * Restablecer contraseña por código de verificación
     * @param req
     */
    @Controller({
        service: UserService.resetPasswordUserToken,
        messages: {
            success: "Contraseña actualizada exitosamente.",
            notFoundCode: "No coincide el código de verificación.",
            samePassword: "La contraseña coincide con la anterior."
        },
        extractParams: (req: Request) => [req.body]
    })
    static resetPasswordUserToken() { void 0 }

}