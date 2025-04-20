import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SystemService } from 'src/app/core/services/system.service';
import { catchError, map, of } from 'rxjs';
import { routesArray } from 'src/app/app.routes';
import { AuthService } from '../services/auth.service';

export const blockMaintenanceGuard: CanActivateFn = (route, state) => {
  const systemService = inject(SystemService);
  const authService = inject(AuthService);
  const router = inject(Router);

  return systemService.controlData$.pipe(
    map((controlData: any) => {

      const control = controlData.find((c: any) => c.id_control === 1);
      const user = authService.getuser(); // Obtener el role del usuario

      if (!control) {

        if (!user || user.id_role !== 1) {
          authService.logoutUser(true);
          router.navigate([routesArray[0]]);  // 404
        }
        return false;
      }

      return true;

    }),
    catchError((error) => {
      router.navigate([routesArray[0]]); // 404
      return of(false);
    })
  );
};
