class HttpResponse {
    /**
     * 🔹 Respuesta estándar para errores
     */
    static errorResponse({ code, message, field, fields, dbs }: ErrorProms) {

        // Verifica si extraField es un objeto, si no, lo envuelve en uno
        const extra = typeof fields === 'object' ? fields : { fields };
        return {
            error: true,
            code,
            message,
            ...(dbs ? { dbs } : null),
            ...field ? { field } : { ...extra },
        };
    }


    /**
     * 🔹 No autenticado (401 Unauthorized)
     */
    static unauthorized({ message, field, dbs }: ResponseProms) {
        return this.errorResponse({ code: 401, message, field, dbs });
    }


    /**
     * 🔹 Recurso no encontrado (404 Not Found)
     */
    static notFound({ message, field, dbs }: ResponseProms) {
        return this.errorResponse({ code: 404, message, field, dbs });
    }


    /**
     * 🔹 Datos incorrectos (400 Bad Request)
     */
    static badRequest({ message, field, dbs, ...fields }: ResponseProms) {
        return this.errorResponse({ code: 400, message, field, fields, dbs });
    }


    /**
     * 🔹 Conflicto (409 Conflict)
     */
    static conflict({ message, field, dbs }: ResponseProms) {
        return this.errorResponse({ code: 409, message, field, dbs });
    }


    /**
     * 🔹 Prohibido (403 Forbidden)
     */
    static forbidden({ message, dbs }: ResponseProms) {
        return this.errorResponse({ code: 403, message, dbs });
    }


    /**
     * 🔹 Éxito (Retorna el formato esperado por el controlador)
     */
    static success({ message, data, meta, dbs = null }: SuccessProms) {
        return {
            error: false,
            message,
            ...(dbs ? { dbs } : null),
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
                },
            } : null),
        };
    }
}

export default HttpResponse;

interface ResponseProms {
    message: string;
    dbs?: any;
    field?: string | null;
    fields?: any;
}

interface ErrorProms {
    code: number;
    dbs?: any;
    message: string;
    field?: string | null;
    fields?: any;
}

interface SuccessProms {
    message: any;
    dbs?: any;
    data?: any;
    meta?: {
        currentPage: number;
        totalPages: number;
        totalRecords: number;
        queryOptions?: {
            limit: number;
            order: any[];
        };
    };
}

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