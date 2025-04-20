import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SystemService } from 'src/app/core/services/system.service';
import { tap } from 'rxjs';
import { routesArray } from 'src/app/app.routes';

export const serverStatusGuard: CanActivateFn = (route, state) => {
  const systemService = inject(SystemService);
  const router = inject(Router);

  return systemService.checkServerStatus().pipe(
    tap((isServerUp: boolean) => {
      if (!isServerUp) {
        router.navigate([routesArray[3]]);  // 500
      }
    })
  );
};
