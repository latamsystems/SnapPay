import { Request, Response as ExpressResponse } from 'express';
import { handleController } from '@/lib/crud/controller/config.controller';

// ============================================================================

/**
 * Controlador de cruds básicos
 * @param service - Servicio que contiene las funciones CRUD
 * @param controllerMethods - Métodos personalizados opcionales
 * @returns Controladores CRUD configurados
 */
const CrudController = <T extends Record<string, (...args: any[]) => Promise<any>>>(
    service: T,
    controllerMethods: Partial<Record<keyof T, (...args: any[]) => Promise<any>>> = {}
) => {
    // Métodos por defecto
    const defaultMethods = {
        getAll: async (req: Request, res: ExpressResponse) => handleController(
            req, res, service.getAll,
            { success: 'Registros obtenidos exitosamente.' },
            [req.query]
        ),

        getById: async (req: Request, res: ExpressResponse) => handleController(
            req, res, service.getById,
            {
                success: 'Registro obtenido exitosamente.',
                notFound: 'Registro no encontrado.'
            },
            [req.params.id]
        ),

        create: async (req: Request, res: ExpressResponse) => handleController(
            req, res, service.create,
            { success: 'Registro creado exitosamente.' },
            [req.body]
        ),

        update: async (req: Request, res: ExpressResponse) => handleController(
            req, res, service.update,
            {
                success: 'Registro actualizado exitosamente.',
                notFound: 'Registro no encontrado.'
            },
            [req.params.id, req.body]
        ),

        delete: async (req: Request, res: ExpressResponse) => handleController(
            req, res, service.delete,
            {
                success: 'Registro eliminado exitosamente.',
                notFound: 'Registro no encontrado.'
            },
            [req.params.id]
        ),

        enable: async (req: Request, res: ExpressResponse) => handleController(
            req, res, service.enable,
            {
                success: 'Se cambió el estado exitosamente.',
                notFound: 'Registro no encontrado.'
            },
            [req.params.id, req.body]
        )
    };

    // Combinar métodos por defecto con métodos personalizados
    return {
        ...defaultMethods,
        ...controllerMethods
    };
};

// ============================================================================

// Exportación para ser utilizado en otros módulos
export { CrudController };
