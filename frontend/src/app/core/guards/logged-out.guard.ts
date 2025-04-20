import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { routesArrayModulo1 } from 'src/app/views/modulo1/modulo1.routes';
import { environment } from 'src/environments/environment.development';

export const loggedOutGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true; // Permitir la navegación si el usuario no ha iniciado sesión
  } else {

    if (environment.status) {
      // Produccion
      window.location.href = `/${environment.nameApp}/inicio`;  // Redirigir a la página de inicio
    } else {
      // Desarrollo
      router.navigate([routesArrayModulo1[0]]); // Redirigir a la página de inicio
    }

    return false;
  }
};
