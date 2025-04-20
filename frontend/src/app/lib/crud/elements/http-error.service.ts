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
  handleHttpError(error: any) {
    console.error('HTTP Error:', error); // Log para depuración
  
    // Si no hay error definido, retornamos mensaje genérico
    if (!error) {
      return {
        type: 'error',
        title: 'Error desconocido',
        message: 'Ocurrió un error inesperado. Intente de nuevo más tarde.',
        persistent: true
      };
    }
  
    const status = error?.status || 0;
    const backendMessage = error?.error?.msg || error?.message;
  
    const errorInfo = this.errorMappings[status] || { 
      title: 'Error desconocido', 
      message: 'Ocurrió un error inesperado. Intente de nuevo más tarde.', 
      type: 'error', 
      persistent: true 
    };
  
    return {
      type: errorInfo.type,
      title: errorInfo.title,
      message: backendMessage || errorInfo.message,
      persistent: errorInfo.persistent
    };
  }
  
}