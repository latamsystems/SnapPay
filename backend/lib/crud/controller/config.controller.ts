import { Request, Response } from 'express';
import ApiResponse from '@/helpers/apiResponse';

/**
 * Función genérica para manejar solicitudes de los controladores
 * @param req - Objeto de solicitud de Express
 * @param res - Objeto de respuesta de Express
 * @param serviceFunction - Función del servicio a ejecutar
 * @param resMsg - Mensajes de respuesta
 * @param params - Parámetros adicionales opcionales
 */
const handleController = async ({ req, res, serviceFunction, resMsg, params = [] }: HandleControllerPromps): Promise<Response | void> => {
    try {
        const result = await serviceFunction(...params, resMsg);
        // Manejar respuestas de error
        if (result.error) {
            return new ApiResponse().handleErrorResponse({ res, result });
        }

        // Respuesta de éxito
        return new ApiResponse().success({ res, msg: result.message, data: result.data, meta: result.meta, dbs: result.dbs });
    } catch (error: any) {
        return new ApiResponse().error({ res, msg: error.message, dbs: error.dbs });
    }
};

// ============================================================================

// Exportación para ser utilizado en otros módulos
export { handleController };


interface HandleControllerPromps {
    req: Request;
    res: Response;
    serviceFunction: (...args: any[]) => Promise<any>;
    resMsg: Record<string, string>;
    params?: any[];
}
