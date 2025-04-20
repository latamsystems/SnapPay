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