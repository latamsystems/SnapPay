import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment.development';
import { routesArray } from 'src/app/app.routes';
import { tap } from 'rxjs';

export const initGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Cargar la información de autenticación antes de activar los guardias de ruta de rol
  return authService.getUserDetails().pipe(
    tap((isAuthenticated: any) => {
      if (!isAuthenticated) {

        if (environment.status) {
          // Produccion
          window.location.href = `/${environment.nameApp}/login`; // Redireccion a login de sistema
        } else {
          // Desarrollo
          router.navigate([routesArray[1]]);      // Redirigir a la página de login
        }

      }
    })
  );
};
