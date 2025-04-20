import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment.development';
import { routesArray } from 'src/app/app.routes';

export const loggedInGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // Permitir la navegación si el usuario ha iniciado sesión
  } else {

    if (environment.status) {
      // Producción
      window.location.href = `/${environment.nameApp}/login`; // Redirecciona a login del sistema
    } else {
      // Desarrollo
      router.navigate([routesArray[1]]); // Redirige a la página de login
    }

    return false;
  }
};
