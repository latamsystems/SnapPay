import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { routesArray } from 'src/app/app.routes';

export const serverStatusInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 0) {
        // Error de conexión (posible caída del servidor)
        router.navigate([routesArray[3]]);
      }
      return throwError(() => error);
    })
  );
};
