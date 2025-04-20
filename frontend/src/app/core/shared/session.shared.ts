import { AuthService } from 'src/app/core/services/auth.service';
import { DetailsUserResoults } from 'src/app/core/interfaces/session';
import { Injectable } from '@angular/core';

@Injectable()
export class SessionShared {

  id_user: number | null = null;
  firstname_user: string | null = null;
  lastname_user: string | null = null;
  role_user: number | null = null;

  constructor(
    protected authService: AuthService
  ) {
    // Obtener datos del usuario
    const getUser: DetailsUserResoults | null = this.authService.getuser();
    if (getUser) {
      this.id_user = getUser.id_user;
      this.firstname_user = getUser.firstname_user;
      this.lastname_user = getUser.lastname_user;
      this.role_user = getUser.id_role;
    }
  }
}
