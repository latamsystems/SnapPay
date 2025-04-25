import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { SocketService } from 'src/app/core/services/socket.service';
import { ApiResponse } from 'src/app/core/interfaces/api-response';
import { ClientResult } from '../../interfaces/entities/client.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  // Endpoint Servidor
  private readonly url: string = `${environment.urlBase}${environment.urlClient}`;

  constructor(
    private readonly http: HttpClient,
    private readonly socketService: SocketService,
  ) { }

  // Desactivar cliente
  deactivateClient(clientId: number | null) {
    return this.http.put<ApiResponse<{ client: ClientResult }>>(`${this.url}/deactivate/${clientId}`, null);
  }

  // Activar cliente
  activateClient(clientId: number | null) {
    return this.http.put<ApiResponse<{ client: ClientResult }>>(`${this.url}/activate/${clientId}`, null);
  }

  //===================================================================
  // WebSokets
  //===================================================================

  // Escuchar eventos de desactivacion de clientes
  onClientDeactivate(): Observable<any> {
    return new Observable(observer => {
      this.socketService.socket.on('client:deactivate', (data) => {
        observer.next(data);
      });
    });
  }

  // Escuchar eventos de activacion de clientes
  onClientActivate(): Observable<any> {
    return new Observable(observer => {
      this.socketService.socket.on('client:activate', (data) => {
        observer.next(data);
      });
    });
  }
}
