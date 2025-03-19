class HttpResponse {
    /**
     * 🔹 Respuesta estándar para errores
     */
    static errorResponse(code: any, message: any, field: any = null, extraField: any = {}) {

        // Verifica si extraField es un objeto, si no, lo envuelve en uno
        const extra = typeof extraField === 'object' ? extraField : { extraField };

        return {
            error: true,
            code,
            message,
            ...field ? { field } : { ...extra }
        };
    }


    /**
     * 🔹 No autenticado (401 Unauthorized)
     */
    static unauthorized({ message, field }: any) {
        return this.errorResponse(401, message, field);
    }


    /**
     * 🔹 Recurso no encontrado (404 Not Found)
     */
    static notFound({ message, field }: any) {
        return this.errorResponse(404, message, field);
    }


    /**
     * 🔹 Datos incorrectos (400 Bad Request)
     */
    static badRequest({ message, ...extraField }: any) {
        return this.errorResponse(400, message, null, extraField);
    }


    /**
     * 🔹 Conflicto (409 Conflict)
     */
    static conflict({ message, field }: any) {
        return this.errorResponse(409, message, field);
    }


    /**
     * 🔹 Prohibido (403 Forbidden)
     */
    static forbidden({message}: any) {
        return this.errorResponse(403, message);
    }

    
    /**
     * 🔹 Éxito (Retorna el formato esperado por el controlador)
     */
    static success(message: any, data: any = {}, meta: any = null) {
        return {
            error: false,
            message,
            data,
            ...(meta ? {
                meta: {
                    page: {
                        currentPage: meta?.currentPage,
                        totalPages: meta?.totalPages,
                        totalRecords: meta?.totalRecords,
                        limit: meta?.queryOptions?.limit,
                    },
                    sort: {
                        by: meta?.queryOptions?.order[0][0],
                        order: meta?.queryOptions?.order[0][1],
                    }
                }
            } : null)
        };
    }
}

export default HttpResponse;

// 200	OK ->                     Operación exitosa.
// 201	Created ->                Recurso creado correctamente.
// 204	No Content ->             Operación exitosa pero sin contenido en la respuesta.
// 400	Bad Request ->            Datos inválidos, errores de validación en el service.
// 401	Unauthorized ->           Credenciales incorrectas o usuario no autenticado.
// 403	Forbidden ->              Acción no permitida para el usuario.
// 404	Not Found ->              Recurso o usuario no encontrado.
// 405	Method Not Allowed ->     Método HTTP no permitido para este endpoint.
// 409	Conflict ->               Conflicto en la solicitud (ej. duplicados o restricciones de integridad).
// 410	Gone ->                   El recurso solicitado ya no está disponible.
// 422	Unprocessable Entity ->   Datos válidos pero no pueden ser procesados (ej. lógica de negocio).
// 429	Too Many Requests ->      Se ha excedido el límite de solicitudes (rate limiting).
// 500	Internal Server Error ->  Error inesperado en el servidor.
// 502	Bad Gateway ->            Problema al conectarse con otro servicio (ej. API externa caída).
// 503	Service Unavailable ->    El servidor está sobrecargado o en mantenimiento.