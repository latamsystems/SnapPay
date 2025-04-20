import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { DetailsUserResoults } from 'src/app/core/interfaces/session';
import { routesArray } from 'src/app/app.routes';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const getUser: DetailsUserResoults | null = authService.getuser();
  const role_user = getUser ? getUser.id_role : null;

  const allowedRoles = (route.data as { allowedRoles: number[] })['allowedRoles'];

  if (role_user !== null && allowedRoles && allowedRoles.includes(role_user)) {
    return true;
  } else {
    router.navigate([routesArray[0]]); // Redirige a 404
    return false;
  }
};
