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
const handleController = async (
    req: Request,
    res: Response,
    serviceFunction: (...args: any[]) => Promise<any>,
    resMsg: Record<string, string>,
    params: any[] = []
): Promise<Response | void> => {
    try {
        const result = await serviceFunction(...params, resMsg);

        // Manejar respuestas de error
        if (result.error) {
            return new ApiResponse().handleErrorResponse(res, result);
        }

        // Respuesta de éxito
        return new ApiResponse().success(res, result.message, result.data, result.meta);
    } catch (error: any) {
        return new ApiResponse().error(res, error.message);
    }
};

// ============================================================================

// Exportación para ser utilizado en otros módulos
export { handleController };




