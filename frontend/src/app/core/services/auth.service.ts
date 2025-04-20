import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { routesArray } from 'src/app/app.routes';
import { DetailsUserResoults } from 'src/app/core/interfaces/session';
import { LoginUserResoult } from 'src/app/core/interfaces/auth';
import { ApiResponse } from 'src/app/core/interfaces/api-response';
import { ErrorHandlerService } from 'src/app/core/services/static/http/httpError.service';
import { TimeSesionService } from 'src/app/core/services/static/layout/time-session.service';
import { AlertDialogService } from 'src/app/lib/alert-dialog/elements/alert-dialog.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Endpoint Servidor
  url: string = `${environment.urlBase}${environment.urlAuth}`;

  // Datos de la sesión como un objeto que sigue la interfaz detailsUserResoults
  private sessionData: DetailsUserResoults | null = null;
  private isLoggingOut: boolean = false;

  constructor(
    private readonly http: HttpClient,
    private readonly alertDialogService: AlertDialogService,
    private readonly timeSesionService: TimeSesionService,
    private readonly errorHandler: ErrorHandlerService,
  ) { }

  // Login usuario
  autenticate(formData: LoginUserResoult): Observable<ApiResponse<LoginUserResoult>> {
    return this.http.post<ApiResponse<LoginUserResoult>>(`${this.url}/login`, formData);
  }

  // Login administrador
  autenticateAdmin(formData: LoginUserResoult): Observable<ApiResponse<LoginUserResoult>> {
    return this.http.post<ApiResponse<LoginUserResoult>>(`${this.url}/admin`, formData);
  }

  // Obtener las credenciales del usuario
  getUserDetails(overwriteTimeSession: boolean = false): Observable<any> {

    // Realizar la solicitud HTTP para obtener los detalles del usuario
    return this.http.get<ApiResponse<DetailsUserResoults>>(`${this.url}/userDetails`)
      .pipe(
        // Actualizar el id de usuario en el servicio después de obtener los detalles del usuario
        tap(userData => {
          this.sessionData = {
            id_user: userData.data.id_user,
            firstname_user: userData.data.firstname_user,
            lastname_user: userData.data.lastname_user,
            id_role: userData.data.id_role,
            iat: userData.data.iat,
            exp: userData.data.exp,
          };

          // Crea la variable del tiempo de sesion si no existe o si se indica que se debe sobrescribir
          if ((overwriteTimeSession === true) || (!localStorage.getItem('time-session'))) {
            localStorage.setItem('time-session', this.sessionData.exp ?? '');
          }
        }),
        catchError((error) => {
          this.logoutUser();
          return throwError(() => error);
        })
      );
  }

  // Cerrar sesion
  logoutUser(isMaintenance: boolean = false) {
    this.isLoggingOut = true;
    return this.http.get<any>(`${this.url}/logout`).subscribe({
      next: (response) => {
        if (!isMaintenance) {
          if (environment.status) {
            // Produccion
            window.location.href = `/${environment.nameApp}/login`;  // Login
          } else {
            // Desarrollo
            window.location.href = routesArray[1];  // Login
          }
        }

        this.clearVarsSession();
        this.isLoggingOut = false;
      },
      error: (error) => {
        if (!isMaintenance) {
          if (environment.status) {
            // Produccion
            window.location.href = `/${environment.nameApp}/login`;  // Login
          } else {
            // Desarrollo
            window.location.href = routesArray[1]; // Login
          }
        }

        this.clearVarsSession();
        this.isLoggingOut = false;
      }
    })
  }

  // Renovar token
  renewTokenUser() {
    this.http.get<any>(`${this.url}/renewToken`).subscribe({
      next: (response) => {
        // Actualizar token
        localStorage.setItem('token', response.data.token);

        // Necesitas suscribirte aquí para que se ejecute el código de actualización
        this.getUserDetails(true).subscribe({
          next: (userData) => {
            // Reiniciar el contador con el nuevo tiempo de expiración
            if (this.sessionData?.exp) {
              const expTimestamp = parseInt(this.sessionData.exp, 10);
              this.timeSesionService.resetCountdown(); // Reiniciar el contador de tiempo
              this.timeSesionService.startCountdown(expTimestamp); // Iniciar el contador con el nuevo tiempo
            }
          },
          error: (error) => {
            const errorData = this.errorHandler.handleHttpError(error);
            // this.alertDialogService.alert_response_server(errorData);
          }
        });
      },
      error: (error) => {
        const errorData = this.errorHandler.handleHttpError(error);
        // this.alertDialogService.alert_response_server(errorData);
      }
    });
  }

  // Obtener datos del usuario
  getuser(): DetailsUserResoults | null {
    return this.sessionData;
  }

  // Verificar la sesion
  isLoggedIn(): boolean {
    // Implementa la lógica para verificar si el usuario ha iniciado sesión,
    return !!localStorage.getItem('token');
  }

  // Eliminar variables con la sesion
  clearVarsSession() {
    // Limpiar variables de sesión y eliminar token del almacenamiento local
    this.sessionData = null;
    localStorage.removeItem('token');
    localStorage.removeItem('time-session');
  }

  // Método para obtener el estado de la bandera
  isLogoutInProgress(): boolean {
    return this.isLoggingOut;
  }
}
