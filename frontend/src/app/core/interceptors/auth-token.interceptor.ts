import { HttpInterceptorFn } from '@angular/common/http';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  // Intenta obtener el token de autenticación del almacenamiento local
  const authToken = localStorage.getItem('token');
  if (authToken && req?.headers?.set) {
    // Si existe un token, clona la solicitud actual y añade el token a las cabeceras
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
    // Envía la solicitud modificada al siguiente manejador en la cadena
    return next(authReq);
  }
  // Si no hay token, simplemente pasa la solicitud original sin modificaciones
  return next(req);
};

