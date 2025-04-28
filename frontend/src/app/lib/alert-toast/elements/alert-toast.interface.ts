 
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


// Base interface with common properties
interface BaseAlertToastProps {
  title: string;
  description: string;
  autoClose?: boolean; // Optional parameter to control auto-closing
  autoCloseDelay?: number; // Optional parameter to control delay in milliseconds
  actionButtonText?: string; // Optional parameter to customize action button text
}

// Success type - only confirm button
interface SuccessAlertToastProps extends BaseAlertToastProps {
  type: "success";
  onAction?: () => Promise<void> | void;
}

// Info, Warning, Question types - confirm and cancel buttons
interface InfoAlertToastProps extends BaseAlertToastProps {
  type: "info";
  onAction?: () => Promise<void> | void;
  onCancel?: () => Promise<void> | void;
}

interface WarningAlertToastProps extends BaseAlertToastProps {
  type: "warning";
  onAction?: () => Promise<void> | void;
  onCancel?: () => Promise<void> | void;
}

interface QuestionAlertToastProps extends BaseAlertToastProps {
  type: "question";
  onAction: () => Promise<void> | void;
  onCancel: () => Promise<void> | void;
}

// Error type - confirm, cancel, and optional retry buttons
interface ErrorAlertToastProps extends BaseAlertToastProps {
  type: "error";
  onAction?: () => Promise<void> | void;
  onCancel?: () => Promise<void> | void;
}

// Loading type - only cancel button
interface LoadingAlertToastProps extends BaseAlertToastProps {
  type: "loading";
  onCancel: () => Promise<void> | void;
}

// Discriminated union of all alert Toast types
export type AlertToastProps =
  | SuccessAlertToastProps
  | InfoAlertToastProps
  | WarningAlertToastProps
  | QuestionAlertToastProps
  | ErrorAlertToastProps
  | LoadingAlertToastProps;


export interface Toast {
    id: string;
    config: AlertToastProps;
    isActionLoading: boolean;
    isCancelLoading: boolean;
    onActionCallback?: () => Promise<void> | void;
    onCancelCallback?: () => Promise<void> | void;
    actionNameButton: string;
    createdAt: number;
}
