import { Request, Response as ExpressResponse } from 'express';
import { handleController } from '@/lib/crud/controller/config.controller';

// ============================================================================

/**
 * Controlador de cruds básicos
 * @param service - Servicio que contiene las funciones CRUD
 * @param controllerMethods - Métodos personalizados opcionales
 * @returns Controladores CRUD configurados
 */
const CrudController = <T extends Record<string, (...args: any[]) => Promise<any>>>({
    service,
    controllerMethods = {}
}: HandleControllerProps<T>) => {
    // Métodos por defecto
    const defaultMethods = {
        getAll: async (req: Request, res: ExpressResponse) => handleController({
            req, res, serviceFunction: service.getAll,
            resMsg: { success: 'Registros obtenidos exitosamente.' },
            params: [req.query]
        }),

        getById: async (req: Request, res: ExpressResponse) => handleController({
            req, res, serviceFunction: service.getById,
            resMsg: {
                success: 'Registro obtenido exitosamente.',
                notFound: 'Registro no encontrado.'
            },
            params: [req.params.id]
        }),

        create: async (req: Request, res: ExpressResponse) => handleController({
            req, res, serviceFunction: service.create,
            resMsg: { success: 'Registro creado exitosamente.' },
            params: [req.body]
        }),

        update: async (req: Request, res: ExpressResponse) => handleController({
            req, res, serviceFunction: service.update,
            resMsg: {
                success: 'Registro actualizado exitosamente.',
                notFound: 'Registro no encontrado.'
            },
            params: [req.params.id, req.body]
        }),

        delete: async (req: Request, res: ExpressResponse) => handleController({
            req, res, serviceFunction: service.delete,
            resMsg: {
                success: 'Registro eliminado exitosamente.',
                notFound: 'Registro no encontrado.'
            },
            params: [req.params.id]
        }),

        enable: async (req: Request, res: ExpressResponse) => handleController({
            req, res, serviceFunction: service.enable,
            resMsg: {
                success: 'Se cambió el estado exitosamente.',
                notFound: 'Registro no encontrado.'
            },
            params: [req.params.id, req.body]
        })
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

interface HandleControllerProps<T> {
    service: T,
    controllerMethods?: Partial<Record<keyof T, (...args: any[]) => Promise<any>>>
}