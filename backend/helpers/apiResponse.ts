import { Response } from 'express';

class ApiResponse {
  /**
   * 🔹 Respuesta de éxito (200 OK)
   */
  public success({ res, msg, dbs = null, data = {}, meta = null, status = 200, }: SuccessResponse): Response {
    return res.status(status).json({
      ok: true,
      msg,
      ...this._formatData({ data }),
      ...(meta ? { meta } : null),
      ...(dbs ? { dbs } : null),
    });
  }


  /**
   * 🔹 Respuesta de error genérico con tipo de error
   */
  public error({ res, msg, dbs = null, errorType = 'InternalServerError', status = 500, details = null }: ErrorResponse): Response {
    const stack = details instanceof Error ? details.stack : null;

    return res.status(status).json({
      ok: false,
      error: errorType,
      msg,
      ...this._formatData({ data: { details, stack } }),
      ...(dbs ? { dbs } : null),
    });
  }


  /**
   * 🔹 Método para manejar respuestas de error de forma estructurada xxx
   */
  public handleErrorResponse({ res, result }: HandleErrorResponse): Response {
    const { code, message, dbs = null, ...extraFields } = result;

    return res.status(code).json({
      ok: false,
      msg: message,
      error: this._mapErrorType({ statusCode: code }),
      ...(dbs ? { dbs } : null),
      ...extraFields
    });
  }


  /**
   * 🔹 Método interno para formatear la data y evitar duplicaciones xxx
   */
  private _formatData({ data }: { data: Record<string, any> }): Record<string, any> {
    return Object.keys(data).length ? { data } : {};
  }


  /**
   * 🔹 Mapea códigos de estado a tipos de error xxx
   */
  private _mapErrorType({ statusCode }: { statusCode: number }): string {
    const errorTypes: Record<number, string> = {
      400: 'BadRequest',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'NotFound',
      405: 'MethodNotAllowed',
      409: 'Conflict',
      410: 'Gone',
      422: 'UnprocessableEntity',
      429: 'TooManyRequests',
      500: 'InternalServerError',
      502: 'BadGateway',
      503: 'ServiceUnavailable'
    };

    return errorTypes[statusCode] || 'UnknownError';
  }
}

export default ApiResponse;

interface SuccessResponse {
  res: Response;
  msg: string;
  dbs?: any;
  data?: Record<string, any>;
  meta?: Record<string, any> | null;
  status?: number;
}

interface ErrorResponse {
  res: Response;
  msg: string;
  dbs?: any;
  errorType?: string;
  status?: number;
  details?: any;
  [key: string]: any;
}

interface HandleErrorResponse {
  res: Response;
  result: {
    code: number;
    message: string;
    dbs?: any[];
    [key: string]: any;
  };
}