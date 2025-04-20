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
