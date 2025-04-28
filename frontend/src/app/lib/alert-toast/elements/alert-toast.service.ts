 
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
import { AlertToastProps, Toast } from "src/app/lib/alert-toast/elements/alert-toast.interface";

@Injectable({
    providedIn: "root",
})
export class AlertToastService {
    private readonly toastsSignal: WritableSignal<Toast[]> = signal([]);
    private readonly autoCloseTimers: Map<string, any> = new Map();

    // Default auto-close delay in milliseconds
    private readonly DEFAULT_AUTO_CLOSE_DELAY = 5000;

    // Default action button text
    private readonly DEFAULT_ACTION_BUTTON_TEXT = "Action";

    // For compatibility with existing code
    private readonly isOpenSignal: WritableSignal<boolean> = signal(false);
    private readonly configSignal: WritableSignal<AlertToastProps | null> = signal(null);
    private readonly isLoadingAction: WritableSignal<boolean> = signal(false);
    private readonly isLoadingCancel: WritableSignal<boolean> = signal(false);

    // Computed values for all toasts
    toasts = computed(() => this.toastsSignal());

    // For backward compatibility with existing code
    isOpen = computed(() => this.isOpenSignal());
    config = computed(() => this.configSignal());
    isActionLoading = computed(() => this.isLoadingAction());
    isCancelLoading = computed(() => this.isLoadingCancel());

    getConfig() {
        return this.configSignal();
    }

    AlertToast(config: AlertToastProps) {
        const toastId = crypto.randomUUID();

        // Store callbacks for this toast
        const onActionCallback = "onAction" in config ? config.onAction : undefined;
        const onCancelCallback = "onCancel" in config ? config.onCancel : undefined;

        // Get action button text or use default
        const actionNameButton = config.actionButtonText ?? this.DEFAULT_ACTION_BUTTON_TEXT;

        const toast: Toast = {
            id: toastId,
            config,
            isActionLoading: false,
            isCancelLoading: false,
            onActionCallback,
            onCancelCallback,
            actionNameButton, // Add the button text
            createdAt: Date.now()
        };

        // Add the toast to our list
        this.toastsSignal.update(toasts => [...toasts, toast]);

        // Check if this toast should auto-close
        // If autoClose is explicitly set to true OR 
        // if it's a success toast and autoClose is not explicitly set to false
        const shouldAutoClose = config.autoClose === true ||
            (config.type === 'success' && config.autoClose !== false);

        if (shouldAutoClose) {
            // Use the provided delay or the default
            const delay = config.autoCloseDelay ?? this.DEFAULT_AUTO_CLOSE_DELAY;

            const timerId = setTimeout(() => {
                this.closeToastById(toastId);
                this.autoCloseTimers.delete(toastId);
            }, delay);

            this.autoCloseTimers.set(toastId, timerId);
        }

        return toastId;
    }

    closeToastById(toastId: string) {
        // Clear any auto-close timer
        if (this.autoCloseTimers.has(toastId)) {
            clearTimeout(this.autoCloseTimers.get(toastId));
            this.autoCloseTimers.delete(toastId);
        }

        this.toastsSignal.update(toasts =>
            toasts.filter(toast => toast.id !== toastId)
        );
    }

    closeAllToasts() {
        // Clear all timers
        this.autoCloseTimers.forEach(timerId => clearTimeout(timerId));
        this.autoCloseTimers.clear();

        this.toastsSignal.set([]);
    }

    async executeToastAction(toastId: string, action: "action" | "cancel") {
        const toast = this.toastsSignal().find(t => t.id === toastId);
        if (!toast) return;

        let callback: (() => Promise<void> | void) | undefined;
        let loadingProperty: 'isActionLoading' | 'isCancelLoading';

        switch (action) {
            case "action":
                callback = toast.onActionCallback;
                loadingProperty = 'isActionLoading';
                break;
            case "cancel":
                callback = toast.onCancelCallback;
                loadingProperty = 'isCancelLoading';
                break;
        }

        if (callback) {
            // Update loading state
            this.toastsSignal.update(toasts =>
                toasts.map(t => t.id === toastId ? { ...t, [loadingProperty]: true } : t)
            );

            try {
                await callback();
            } catch (error) {
                console.error(`Error en la acción ${action}:`, error);
            } finally {
                // Update loading state back to false (in case the toast hasn't been closed)
                this.toastsSignal.update(toasts => {
                    const updatedToasts = toasts.map(t =>
                        t.id === toastId ? { ...t, [loadingProperty]: false } : t
                    );
                    return updatedToasts;
                });

                this.closeToastById(toastId);
            }
        } else {
            this.closeToastById(toastId);
        }
    }

    // For backward compatibility with existing code
    closeToast() {
        this.closeAllToasts();
        this.isOpenSignal.set(false);
        this.configSignal.set(null);
    }

    // For backward compatibility with existing code
    async executeAction(action: "action" | "cancel") {
        let callback: (() => Promise<void> | void) | undefined;
        let loadingSignal: WritableSignal<boolean>;

        switch (action) {
            case "action":
                callback = "onAction" in (this.configSignal() || {})
                    ? (this.configSignal() as any).onAction
                    : undefined;
                loadingSignal = this.isLoadingAction;
                break;
            case "cancel":
                callback = "onCancel" in (this.configSignal() || {})
                    ? (this.configSignal() as any).onCancel
                    : undefined;
                loadingSignal = this.isLoadingCancel;
                break;
        }

        if (callback) {
            loadingSignal.set(true);
            try {
                await callback();
            } catch (error) {
                console.error(`Error en la acción ${action}:`, error);
            } finally {
                loadingSignal.set(false);
                this.closeToast();
            }
        } else {
            this.closeToast();
        }
    }
}