import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  /**
   * Mapeo de códigos de estado HTTP a mensajes amigables y su tipo de alerta.
   */
  private readonly errorMappings: { [key: number]: { title: string, message: string, type: 'error' | 'info', persistent: boolean  } } = {
    400: { type: 'info',    title: 'Solicitud incorrecta',   message: 'Los datos enviados no son válidos. Verifique e intente de nuevo.',       persistent: false },
    401: { type: 'info',    title: 'No autorizado',          message: 'Debe iniciar sesión para acceder a esta función.',                       persistent: true },
    403: { type: 'error',   title: 'Acceso denegado',        message: 'No tiene permisos para realizar esta acción.',                           persistent: true },
    404: { type: 'info',    title: 'No encontrado',          message: 'El recurso solicitado no existe o fue eliminado.',                       persistent: false },
    409: { type: 'info',    title: 'Conflicto',              message: 'Conflicto en la solicitud. Verifique los datos ingresados.',             persistent: false },
    422: { type: 'info',    title: 'Datos no procesables',   message: 'Los datos son válidos, pero no pueden ser procesados en este momento.',  persistent: false },
    429: { type: 'info',    title: 'Demasiadas solicitudes', message: 'Ha realizado demasiadas solicitudes. Intente más tarde.',                persistent: true },
    500: { type: 'error',   title: 'Error del servidor',     message: 'Ocurrió un error inesperado. Intente más tarde.',                        persistent: true },
    503: { type: 'error',   title: 'Servicio no disponible', message: 'El servidor está en mantenimiento o sobrecargado.',                      persistent: true }
  };

  constructor() {}

  /**
   * Manejo de errores HTTP y retorno de un mensaje estructurado con tipo de alerta.
   */
  handleHttpError(error: HttpErrorResponse) {

    const status = error.status;
    const backendMessage = error?.error?.msg; // Extraer mensaje del backend si está presente
    const defaultMessage = 'Ocurrió un error inesperado. Intente de nuevo más tarde.';

    // Obtener la información del error o usar un mensaje genérico
    const errorInfo = this.errorMappings[status] || { 
      title: 'Error desconocido', 
      message: defaultMessage, 
      type: 'error', 
      persistent: true 
    };

    return {
      type: errorInfo.type, // Tipo de alerta dinámico
      title: errorInfo.title,
      message: backendMessage || errorInfo.message, // Usar mensaje del backend si está presente
      persistent: errorInfo.persistent // Nueva propiedad de persistencia
    };
  }
}