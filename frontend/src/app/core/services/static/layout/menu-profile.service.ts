import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  // Ocultar el menu de perfil al hacer clic en cualquier parte de la pagina que no sea el componente del menu
  private readonly showMenuProfileSubject = new BehaviorSubject<boolean>(false);
  showMenuProfile$ = this.showMenuProfileSubject.asObservable();

  toggleMenuProfile() {
    this.showMenuProfileSubject.next(!this.showMenuProfileSubject.value);
  }

  closeMenuProfile() {
    this.showMenuProfileSubject.next(false);
  }
}
