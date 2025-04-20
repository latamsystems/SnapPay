import { Subscription } from 'rxjs';
import { SidebarService } from '../services/static/layout/sidebar.service';
import { Injectable } from '@angular/core';

@Injectable()
export class SidebarShared {

  // Estado del sidebar
  sidebarHidden: boolean = false;
  sidebarSubscription!: Subscription;

  protected subscriptions: Subscription[] = [];

  constructor(
    protected sidebarService: SidebarService
  ) {
    // Estado del sidebar
    this.getStatusSidebar();
  }

  destroy(): void {
    // Desuscribirse del Subject al destruir el componente para evitar posibles fugas de memoria
    this.sidebarSubscription.unsubscribe();
  }

  // Obtener el estado del sidebar
  getStatusSidebar() {
    // Suscribirse al Subject para recibir actualizaciones sobre el estado del sidebar
    this.sidebarSubscription = this.sidebarService.getSidebarHidden().subscribe((sidebarHidden: boolean) => {
      this.sidebarHidden = sidebarHidden; // Actualizamos el valor de sidebarHidden
    });
  }

}