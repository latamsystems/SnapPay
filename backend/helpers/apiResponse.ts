import { Response } from 'express';

class ApiResponse {
  /**
   * 🔹 Respuesta de éxito (200 OK)
   */
  public success(
    res: Response,
    msg: string,
    data: Record<string, any> = {},
    meta: Record<string, any> | null = null,
    status: number = 200
  ): Response {
    return res.status(status).json({
      ok: true,
      msg,
      ...this._formatData(data),
      ...(meta ? { meta } : null)
    });
  }


  /**
   * 🔹 Respuesta de error genérico con tipo de error xxx
   */
  public error(
    res: Response,
    msg: string,
    errorType: string = 'InternalServerError',
    status: number = 500,
    details: any = null
  ): Response {
    const stack = details instanceof Error ? details.stack : null;
    return res.status(status).json({
      ok: false,
      error: errorType,
      msg,
      ...this._formatData({ details, stack })
    });
  }


  /**
   * 🔹 Método para manejar respuestas de error de forma estructurada xxx
   */
  public handleErrorResponse(
    res: Response,
    result: {
      code: number;
      message: string;
      [key: string]: any;
    }
  ): Response {
    const { code, message, ...extraFields } = result;

    return res.status(code).json({
      ok: false,
      msg: message,
      error: this._mapErrorType(code),
      ...extraFields
    });
  }


  /**
   * 🔹 Método interno para formatear la data y evitar duplicaciones xxx
   */
  private _formatData(data: Record<string, any>): Record<string, any> {
    return Object.keys(data).length ? { data } : {};
  }

  
  /**
   * 🔹 Mapea códigos de estado a tipos de error xxx
   */
  private _mapErrorType(statusCode: number): string {
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
