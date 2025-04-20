import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SystemService } from 'src/app/core/services/system.service';
import { catchError, map, of } from 'rxjs';
import { routesArray } from 'src/app/app.routes';

export const maintenanceGuard: CanActivateFn = (route, state) => {
  const systemService = inject(SystemService);
  const router = inject(Router);

  return systemService.controlData$.pipe(
    map((controlData: any) => {

      const control = controlData.find((c: any) => c.id_control === 1);

      if (control) {
        if (control.id_status === 1) {

          // Verificar si la ruta actual es routesArray[4]
          // if (state.url === routesArray[4]) {
          router.navigate([routesArray[2]]);  // mantenimiento
          return false;
          // }
        }
      }
      return true;

    }),
    catchError((error) => {
      router.navigate([routesArray[0]]); // 404
      return of(false);
    })
  );
};
