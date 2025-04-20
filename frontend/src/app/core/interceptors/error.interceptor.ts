import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AlertToastService } from 'src/app/lib/alert-toast/elements/alert-toast.service';
import { AppInjector } from 'src/app/app.component';
import { AuthService } from 'src/app/core/services/auth.service';
import { ErrorHandlerService } from 'src/app/core/services/static/http/httpError.service';

let errorTimeout: any = null; // Variable para controlar el temporizador

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const alertService = AppInjector.get(AlertToastService);
  const authService = AppInjector.get(AuthService);
  const errorHandleService = AppInjector.get(ErrorHandlerService);

  return next(req).pipe(
    catchError((error) => {

      if (authService.isLogoutInProgress()) {
        // Si se está cerrando sesión, no mostrar alertas de error
        return throwError(() => error);
      }

      // Llamada al servicio de manejo de errores
      const errorData = errorHandleService.handleHttpError(error);
      const { type, title, message, persistent } = errorData;

      const showError = (type: string, title: string, message: string) => {
        if (!errorTimeout) {

          alertService.AlertToast({
            type: 'error',
            title: title,
            description: message,
            autoClose: persistent
          });

          console.error(`${title}: ${message}`);

          errorTimeout = setTimeout(() => {
            errorTimeout = null;
          }, 5000); // Muestra un error cada 5 segundos
        }
      };

      // Mostrar el error con el tipo, título y mensaje proporcionados
      showError(type, title, message);

      // Continúa lanzando el error para que pueda ser manejado por otros catchers
      return throwError(() => error);
    })
  );
};
