import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { SocketService } from 'src/app/core/services/socket.service';
import { ApiResponse } from 'src/app/core/interfaces/api-response';
import { PasswdChangeResults, UserResult } from 'src/app/core/interfaces/entities/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Endpoint Servidor
  private readonly url: string = `${environment.urlBase}${environment.urlUser}`;

  constructor(
    private readonly http: HttpClient,
    private readonly socketService: SocketService,
  ) { }

  // Actualizar perfil
  updateProfileById(userId: number | null, formData: UserResult) {
    return this.http.put<ApiResponse<{ user: UserResult }>>(`${this.url}/profile/${userId}`, formData);
  }

  // Actualizar contraseña
  updatePasswordById(userId: number | null, formData: PasswdChangeResults) {
    return this.http.put<ApiResponse<{ user: UserResult }>>(`${this.url}/profile/password/${userId}`, formData);
  }

  // Desactivar usuario
  deactivateUser(userId: number | null) {
    return this.http.put<ApiResponse<{ user: UserResult }>>(`${this.url}/deactivate/${userId}`, null);
  }

  // Activar usuario
  activateUser(userId: number | null) {
    return this.http.put<ApiResponse<{ user: UserResult }>>(`${this.url}/activate/${userId}`, null);
  }

  // Restablecer contraseña
  resetPasswordUser(userId: number | null, userIdentification: string | null) {
    return this.http.put<ApiResponse<{ user: UserResult }>>(`${this.url}/reset/password/${userId}/${userIdentification}`, null);
  }

  // MAIL
  // Restablecer contraseña por token
  resetPasswordUserToken(formdata: any) {
    return this.http.put<ApiResponse<any>>(`${this.url}/reset/passwordCode`, formdata);
  }

  // Verificar token para restablecimiento de contraseña
  resetPasswordUserTokenVerify(formdata: any) {
    return this.http.put<ApiResponse<any>>(`${this.url}/reset/passwordCodeVerify`, formdata);
  }

  //===================================================================
  // WebSokets
  //===================================================================

  //Escuchar eventos de creación de usuarios
  onUserCreated(): Observable<any> {
    return new Observable(observer => {
      this.socketService.socket.on('user:created', (data) => {
        observer.next(data);
      });
    });
  }

  // Escuchar eventos de actualización de usuarios
  onUserUpdated(): Observable<any> {
    return new Observable(observer => {
      this.socketService.socket.on('user:updated', (data) => {
        observer.next(data);
      });
    });
  }

  // Escuchar eventos de eliminación de usuarios
  onUserDeleted(): Observable<any> {
    return new Observable(observer => {
      this.socketService.socket.on('user:deleted', (data) => {
        observer.next(data);
      });
    });
  }

  // Escuchar eventos de desactivacion de usuarios
  onUserDeactivate(): Observable<any> {
    return new Observable(observer => {
      this.socketService.socket.on('user:deactivate', (data) => {
        observer.next(data);
      });
    });
  }

  // Escuchar eventos de activacion de usuarios
  onUserActivate(): Observable<any> {
    return new Observable(observer => {
      this.socketService.socket.on('user:activate', (data) => {
        observer.next(data);
      });
    });
  }
}
