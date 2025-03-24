import HttpResponse from "@/helpers/httpResponse";
import Console from "@/helpers/console";

// ============================================================================

interface HandleServiceProps<T, U extends any[]> {
    consoleHelper: Console;
    serviceFunction: (...args: U) => Promise<T>;
    params: U;
}

/**
 * Método centralizado para manejar las operaciones de servicio
 * @param consoleHelper - Instancia de Console para logs
 * @param serviceFunction - La función de servicio a ejecutar
 * @param params - Parámetros adicionales requeridos por la función
 */
const handleService = async <T, U extends any[]>({
    consoleHelper,
    serviceFunction,
    params
}: HandleServiceProps<T, U>): Promise<T> => {
    try {
        // Ejecutar el servicio
        const result: T = await serviceFunction(...params || []);

        // Registrar el mensaje correcto basado en el resultado
        return defaultResult(result, consoleHelper);

    } catch (error: any) {
        return defaultError(error, consoleHelper);
    }
};

// ============================================================================

/**
 * Método de resultado por defecto 
 * @param result 
 * @param consoleHelper 
 */
const defaultResult = (result: any, consoleHelper: Console) => {
    if ((result)?.error) {
        consoleHelper.info((result).message);
    } else {
        consoleHelper.success((result).message);
    }

    return result;
}

// ============================================================================

/**
 * Método de manejo de errores por defecto
 * @param error 
 * @param consoleHelper 
 * @returns 
 */
const defaultError = async (error: any, consoleHelper: Console) => {

    // Si el error es un HttpResponse, devolverlo tal cual
    if (error?.error) {
        consoleHelper?.error(error.message);
        return error;
    }

    // Si el error es de llave foránea
    if (error.name === 'SequelizeForeignKeyConstraintError') {
        const sql = error?.parent?.sql?.toUpperCase() || '';

        if (sql.includes('DELETE')) {
            const errorMessage = "Este registro no se puede eliminar porque tiene historial.";
            consoleHelper?.error(errorMessage);
            return HttpResponse.errorResponse(400, errorMessage);
        }

        if (sql.includes('INSERT')) {
            const errorMessage = "No se puede registrar porque una de las relaciones no existe.";
            consoleHelper?.error(errorMessage);
            return HttpResponse.errorResponse(400, errorMessage);
        }

        if (sql.includes('UPDATE')) {
            const errorMessage = "No se puede actualizar porque una de las relaciones no existe.";
            consoleHelper?.error(errorMessage);
            return HttpResponse.errorResponse(400, errorMessage);
        }

        // Caso genérico
        const fallbackMessage = error?.parent?.sqlMessage || "Error de clave foránea.";
        consoleHelper?.error(fallbackMessage);
        return HttpResponse.errorResponse(400, fallbackMessage);
    }

    // Verificación directa por el nombre del error
    if (error.name === 'SequelizeUniqueConstraintError') {
        const duplicateMessage = error?.parent?.sqlMessage || "El valor ya existe y debe ser único.";
        consoleHelper?.error(duplicateMessage);
        return HttpResponse.errorResponse(400, duplicateMessage);
    }

    // Si no es un error de unicidad, manejar como error genérico
    consoleHelper?.error(error.message);
    return HttpResponse.errorResponse(500, error.message);
}

// ============================================================================

export { handleService, defaultResult, defaultError };

