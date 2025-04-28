 
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
interface BaseAlertDialogProps {
  title: string;
  description: string;
}

// Success type - only confirm button
interface SuccessAlertDialogProps extends BaseAlertDialogProps {
  type: "success";
  onConfirm: () => Promise<void> | void;
}

// Info, Warning, Question types - confirm and cancel buttons
interface InfoAlertDialogProps extends BaseAlertDialogProps {
  type: "info";
  onConfirm: () => Promise<void> | void;
  onCancel?: () => Promise<void> | void;
}

interface WarningAlertDialogProps extends BaseAlertDialogProps {
  type: "warning";
  onConfirm: () => Promise<void> | void;
  onCancel?: () => Promise<void> | void;
}

interface QuestionAlertDialogProps extends BaseAlertDialogProps {
  type: "question";
  onConfirm: () => Promise<void> | void;
  onCancel: () => Promise<void> | void;
}

// Error type - confirm, cancel, and optional retry buttons
interface ErrorAlertDialogProps extends BaseAlertDialogProps {
  type: "error";
  onConfirm: () => Promise<void> | void;
  onCancel?: () => Promise<void> | void;
  onRetry?: () => Promise<void> | void;
}

// Loading type - only cancel button
interface LoadingAlertDialogProps extends BaseAlertDialogProps {
  type: "loading";
  onCancel: () => Promise<void> | void;
}

// Discriminated union of all alert dialog types
export type AlertDialogProps =
  | SuccessAlertDialogProps
  | InfoAlertDialogProps
  | WarningAlertDialogProps
  | QuestionAlertDialogProps
  | ErrorAlertDialogProps
  | LoadingAlertDialogProps;


// Dialog interface for internal use
export interface Dialog {
  config: AlertDialogProps;
  isConfirmLoading: boolean;
  isCancelLoading: boolean;
  isRetryLoading: boolean;
}