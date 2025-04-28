import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { SocketService } from 'src/app/core/services/socket.service';
import { ApiResponse } from 'src/app/core/interfaces/api-response';
import { DeviceResult } from '../../interfaces/entities/device.interface';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  // Endpoint Servidor
  private readonly url: string = `${environment.urlBase}${environment.urlDevice}`;

  constructor(
    private readonly http: HttpClient,
    private readonly socketService: SocketService,
  ) { }

  // Desactivar dispositivo
  deactivateDevice(deviceId: number | null) {
    return this.http.put<ApiResponse<{ device: DeviceResult }>>(`${this.url}/deactivate/${deviceId}`, null);
  }

  // Activar dispositivo
  activateDevice(deviceId: number | null) {
    return this.http.put<ApiResponse<{ device: DeviceResult }>>(`${this.url}/activate/${deviceId}`, null);
  }

  //===================================================================
  // WebSokets
  //===================================================================

  // Escuchar eventos de desactivacion de dispositivos
  onDeviceDeactivate(): Observable<any> {
    return new Observable(observer => {
      this.socketService.socket.on('device:deactivate', (data) => {
        observer.next(data);
      });
    });
  }

  // Escuchar eventos de activacion de dispositivos
  onDeviceActivate(): Observable<any> {
    return new Observable(observer => {
      this.socketService.socket.on('device:activate', (data) => {
        observer.next(data);
      });
    });
  }
}
