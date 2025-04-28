 
// ===============================================
// Librería de Componentes y Funciones - tailjNg
// ===============================================
// Descripción:
//   Esta librería está diseñada para ofrecer un conjunto de componentes reutilizables y funciones
//   optimizadas para facilitar el desarrollo de interfaces de usuario y la gestión de datos en aplicaciones 
//   web. Incluye herramientas para mejorar la experiencia del desarrollador y la interacción con el usuario.
// Propósito:
//   - Crear componentes modulares y personalizables.
//   - Mejorar la eficiencia del desarrollo front-end mediante herramientas reutilizables.
//   - Proporcionar soluciones escalables y fáciles de integrar con aplicaciones existentes.
// Uso:
//   Para obtener la funcionalidad completa, simplemente importa los módulos necesarios y usa los 
//   componentes según tu caso de uso. Asegúrate de revisar la documentación oficial para obtener ejemplos 
//   detallados sobre su implementación y personalización.
// Autores:
//   Armando Josue Velasquez Delgado - Desarrollador principal
// Licencia:
//   Este proyecto está licenciado bajo la MIT - ver el archivo LICENSE para más detalles.
// Versión: 0.0.9
// Fecha de creación: 2025-01-04
// =============================================== 

import { Injectable, signal, computed, WritableSignal } from "@angular/core";
import { firstValueFrom, isObservable, Observable } from "rxjs";
import { AlertDialogProps, Dialog } from "src/app/lib/alert-dialog/elements/alert-dialog.interface";

type ActionCallback = () => void | Promise<void> | Observable<any>;

@Injectable({
  providedIn: "root",
})
export class AlertDialogService {
  private readonly isOpenSignal: WritableSignal<boolean> = signal(false);
  private readonly configSignal: WritableSignal<AlertDialogProps | null> = signal(null);

  // Estados de carga para los botones
  private readonly isLoadingConfirm: WritableSignal<boolean> = signal(false);
  private readonly isLoadingCancel: WritableSignal<boolean> = signal(false);
  private readonly isLoadingRetry: WritableSignal<boolean> = signal(false);


  // Callbacks
  private onConfirmCallback?: ActionCallback;
  private onCancelCallback?: ActionCallback;
  private onRetryCallback?: ActionCallback;

  isOpen = computed(() => this.isOpenSignal());
  config = computed(() => this.configSignal());

  isConfirmLoading = computed(() => this.isLoadingConfirm());
  isCancelLoading = computed(() => this.isLoadingCancel());
  isRetryLoading = computed(() => this.isLoadingRetry());

  // Add a dialogs computed property that returns an array with a single dialog when open
  dialogs = computed<Dialog[]>(() => {
    if (!this.isOpenSignal()) return [];

    return [{
      config: this.configSignal()!,
      isConfirmLoading: this.isLoadingConfirm(),
      isCancelLoading: this.isLoadingCancel(),
      isRetryLoading: this.isLoadingRetry()
    }];
  });

  getConfig() {
    return this.configSignal();
  }

  AlertDialog(config: AlertDialogProps) {
    this.onConfirmCallback = "onConfirm" in config ? config.onConfirm : undefined;
    this.onCancelCallback = "onCancel" in config ? config.onCancel : undefined;
    this.onRetryCallback = "onRetry" in config ? config.onRetry : undefined;

    // Reset loading states
    this.isLoadingConfirm.set(false);
    this.isLoadingCancel.set(false);
    this.isLoadingRetry.set(false);

    this.configSignal.set(config);
    this.isOpenSignal.set(true);
  }

  closeDialog() {
    this.isOpenSignal.set(false);
    this.configSignal.set(null);
  }

  async executeAction(action: "confirm" | "cancel" | "retry") {
    let callback: ActionCallback | undefined;
    let loadingSignal: WritableSignal<boolean>;
  
    switch (action) {
      case "confirm":
        callback = this.onConfirmCallback;
        loadingSignal = this.isLoadingConfirm;
        break;
      case "cancel":
        callback = this.onCancelCallback;
        loadingSignal = this.isLoadingCancel;
        break;
      case "retry":
        callback = this.onRetryCallback;
        loadingSignal = this.isLoadingRetry;
        break;
    }
  
    if (!callback) {
      this.closeDialog();
      return;
    }
  
    loadingSignal.set(true);
  
    try {
      const result = callback();
  
      // Soporte para Observable
      if (isObservable(result)) {
        await firstValueFrom(result);
      }
  
      // Soporte para Promise
      if (result instanceof Promise) {
        await result;
      }
  
      // Si es void, no hacemos nada extra
    } catch (error) {
      console.error(`Error en la acción ${action}:`, error);
    } finally {
      loadingSignal.set(false);
      this.closeDialog();
    }
  }
  
}