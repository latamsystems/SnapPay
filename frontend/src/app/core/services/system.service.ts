import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { AuthService } from 'src/app/core/services/auth.service';
import { SocketService } from 'src/app/core/services/socket.service';
import { Router } from '@angular/router';
import { routesArray } from 'src/app/app.routes';
import { ApiResponse } from 'src/app/core/interfaces/api-response';
import { ControlResult } from 'src/app/core/interfaces/entities/control.interface';
import { AlertToastService } from 'src/app/lib/alert-toast/elements/alert-toast.service';

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  // Endpoint Servidor
  url: string = `${environment.urlBase}${environment.urlAuth}`;
  url2: string = `${environment.urlBase}${environment.urlControl}`;

  // BehaviorSubject para los datos de los controles
  private readonly controlDataSubject = new BehaviorSubject<any[]>([]);
  controlData$ = this.controlDataSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly socketService: SocketService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly alertToastService: AlertToastService,
  ) {
    this.initializeSocketListeners();
    this.updateControlData(); // Realiza una verificación inicial al cargar el servicio
  }

  // Verificar estado del servidor
  checkServerStatus(): Observable<boolean> {
    return this.http.get(`${this.url}/ping`, { responseType: 'text' }).pipe(
      map(() => {
        console.log('checkServerStatus - server is up');
        return true;
      }),
      catchError((error: HttpErrorResponse) => {

        console.log('checkServerStatus - server is down', error);
        const user = this.authService.getuser();  // Obtener el role del usuario
        const currentUrl = this.router.url; // Obtener la ruta actual

        if (error.status === 0 || error.status === 404) {
          if ((!user || user.id_role !== 1) && currentUrl !== routesArray[4] && currentUrl !== routesArray[5]) {
            this.authService.logoutUser(true);
          }
          return of(false);
        }
        return of(false);
      })
    );
  }

  // Obtener los datos del control
  getControlData(isUpdate: boolean = false, controlId?: number): Observable<any> {

    return this.http.get<any>(this.url2).pipe(
      tap(control => {

        if (control.ok && control.data && Array.isArray(control.data.control)) {
          const processedControlData = control.data.control.map((c: any) => ({
            id_control: c.id_control,
            name_control: c.name_control,
            id_status: c.id_status,
          }));

          this.controlDataSubject.next(processedControlData);
          this.checkMaintenanceMode(processedControlData, isUpdate, controlId); // Verificar modo de mantenimiento

        } else {
          this.controlDataSubject.next([]);
        }
      }),
      map(() => this.controlDataSubject.value) // Asegúrate de retornar los datos de control
    );
  }

  // Método para actualizar los datos de control
  updateControlData(isUpdate: boolean = false, controlId?: number): void {
    this.getControlData(isUpdate, controlId).subscribe();

  }

  // Método para verificar los controladores
  private checkMaintenanceMode(controlData: any[], isUpdate: boolean = false, controlId?: number): void {
    const control = controlData.find((c: any) => c.id_control === 1);
    const user = this.authService.getuser();  // Obtener rol del usuario
    const currentUrl = this.router.url; // Obtener la ruta actual

    if (control && control.id_status === 1) {
      if ((!user || user.id_role !== 1) && currentUrl !== routesArray[4] && currentUrl !== routesArray[5]) {
        this.authService.logoutUser(true);
        this.router.navigate([routesArray[2]]); // Mantenimiento
      }
    }

    if (isUpdate && controlId) {
      const controls = controlData.find((c: any) => c.id_control === controlId);

      // Alerta del cambio de modo mantenimiento
      if (controlId === 1) {
        if (controls.id_status === 1) {
          this.alertToastService.AlertToast({
            type: 'info',
            title: 'Control Mantenimiento',
            description: 'Modo mantenimiento activado',
            autoClose: false,
          })
        } else {
          this.alertToastService.AlertToast({
            type: 'info',
            title: 'Control Mantenimiento',
            description: 'Modo mantenimiento desactivado',
            autoClose: false,
          })
        }
      }

      // Alerta del cambio de chat de whatsapp
      if (controlId === 2) {
        if (controls.id_status === 1) {
          this.alertToastService.AlertToast({
            type: 'info',
            title: 'Control Chats',
            description: 'Chat de WhatsApp activado',
          })
        } else {
          this.alertToastService.AlertToast({
            type: 'info',
            title: 'Control Chats',
            description: 'Chat de WhatsApp desactivado',
          })
        }
      }

      // Alerta del cambio de chatbot
      if (controlId === 3) {
        if (controls.id_status === 1) {
          this.alertToastService.AlertToast({
            type: 'info',
            title: 'Control Chats',
            description: 'Chatbot activado',
          })
        } else {
          this.alertToastService.AlertToast({
            type: 'info',
            title: 'Control Chats',
            description: 'Chatbot desactivado',
          })
        }
      }

      // Alerta del cambio de chat general
      if (controlId === 4) {
        if (controls.id_status === 1) {
          this.alertToastService.AlertToast({
            type: 'info',
            title: 'Control Chats',
            description: 'Chat general activado',
          })
        } else {
          this.alertToastService.AlertToast({
            type: 'info',
            title: 'Control Chats',
            description: 'Chat general desactivado',
          })
        }
      }

    }
  }

  // Actualizar estado control
  updateControls(id_control: number, id_status: number) {
    return this.http.put<ApiResponse<{ control: ControlResult }>>(`${this.url2}/update/${id_control}/${id_status}`, null);
  }

  //===================================================================
  // WebSokets
  //===================================================================

  // Inicializar escuchas de WebSocket
  private initializeSocketListeners(): void {
    this.socketService.socket.on('control:update', (controlId) => {
      console.log(controlId)
      this.updateControlData(true, Number(controlId));
    });
  }
}
