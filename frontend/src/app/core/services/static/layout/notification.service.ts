import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  // Ocultar el panel de notificaciones hacer clic en cualquier parte de la pagina que no sea el componente de notificacion
  private readonly showNotificationSubject = new BehaviorSubject<boolean>(false);
  showNotification$ = this.showNotificationSubject.asObservable();

  toggleNotification() {
    this.showNotificationSubject.next(!this.showNotificationSubject.value);
  }

  closeNotification() {
    this.showNotificationSubject.next(false);
  }
}
