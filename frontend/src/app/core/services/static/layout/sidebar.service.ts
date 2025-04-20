import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  // Sidebar
  sidebarHidden: boolean = true;
  originalDividerContents: { [key: number]: string } = {}; // Almacena los contenidos originales de los dividers
  sidebarHiddenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.checkSidebarStorage()); // BehaviorSubject para emitir el estado del sidebar

  constructor() { }

  // Cambiar estado del sidebar
  toggleSidebar(): boolean {
    this.sidebarHidden = !this.sidebarHidden;

    const element_autors = document.querySelector('.content-autors') as HTMLElement;

    // Cambiar de texto segun el estado del sidebar
    const dividers = document.querySelectorAll('.divider');
    dividers.forEach((divider: Element, index: number) => {
      if (divider instanceof HTMLElement) {
        // Si es la primera vez que se ejecuta toggleSidebar(), almacena el contenido original
        if (!this.originalDividerContents[index]) {
          this.originalDividerContents[index] = divider.textContent ?? '';
        }
        // Actualizar el texto de acuerdo al estado del sidebar
        if (this.sidebarHidden) {
          divider.textContent = '-';

          if (element_autors) {
            element_autors.style.opacity = '0';
          }

        } else {
          // Restaurar el contenido original
          divider.textContent = this.originalDividerContents[index];

          // Después de 0.03 segundos, mostrar el elemento .content-autors
          setTimeout(() => {
            if (element_autors) {
              element_autors.style.opacity = '1';
            }
          }, 30); // 30 milisegundos = 0.03 segundos
        }
      }
    });
    // Actualizar el valor de 'sidebar' en el localStorage
    localStorage.setItem('sidebar', this.sidebarHidden.toString());
    this.sidebarHiddenSubject.next(this.sidebarHidden); // Emitir el nuevo estado del sidebar
    return this.sidebarHidden;
  }

  // Verifica el estado del sidebar
  checkSidebarStorage(): boolean {
    // Obtener el valor de 'sidebar' del localStorage
    const sidebarValue = localStorage.getItem('sidebar');
    // Si 'sidebar' existe en el localStorage, establecer sidebarHidden en su valor
    if (sidebarValue !== null) {
      this.sidebarHidden = sidebarValue === 'true';
    } else {
      // Si 'sidebar' no existe en el localStorage, establecer sidebarHidden en true
      this.sidebarHidden = true;
      // Guardar sidebarHidden en el localStorage
      localStorage.setItem('sidebar', 'true');
    }
    return this.sidebarHidden;
  }

  // Cambiar nombre de dividers del sidebar
  changeNameDividers(sidebar: boolean) {

    // Almacenar el contenido original de los dividers cuando carga la página
    const dividers = document.querySelectorAll('.divider');
    dividers.forEach((divider: Element, index: number) => {
      if (divider instanceof HTMLElement) {
        this.originalDividerContents[index] = divider.textContent ?? '';
      }
      // Asignar si el sidebar esta oculto
      if (sidebar) {
        // console.log(`${sidebar} entra al cambio verdadero`)
        divider.textContent = '-';
      }
    });
  }

  getSidebarHidden(): Observable<boolean> {
    return this.sidebarHiddenSubject.asObservable();
  }
}

