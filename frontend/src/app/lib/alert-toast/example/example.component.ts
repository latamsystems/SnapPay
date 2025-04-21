import { Component } from '@angular/core';
import { AlertToastService } from 'src/app/lib/alert-toast/elements/alert-toast.service';
import { JButtonComponent } from 'src/app/lib/button/button.component';

@Component({
  selector: 'app-alert-toast-example',
  imports: [JButtonComponent],
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss'
})
export class AlertToastExampleComponent {

  constructor(private readonly alertToastService: AlertToastService) { }

  // Success with auto-close (default behavior)
  openAlertSuccess() {
    this.alertToastService.AlertToast({
      type: "success",
      title: "Success inesperado",
      description: "Descripcion de success. Auto-cierre en 5 segundos (por defecto).",
      onAction: async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Confirmar success");
      },
      // autoClose is true by default for success
    });
  }

  // Success without auto-close
  openAlertSuccessNoAutoClose() {
    this.alertToastService.AlertToast({
      type: "success",
      title: "Success sin auto-cierre",
      description: "Este toast no se cerrará automáticamente.",
      autoClose: false, // Explicitly disable auto-close
      actionButtonText: "Confirmar",
      onAction: async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Confirmar success");
      },
    });
  }

  // Info with custom auto-close delay
  openAlertInfo() {
    this.alertToastService.AlertToast({
      type: "info",
      title: "Info con auto-cierre",
      description: "Este toast se cerrará en 10 segundos.",
      autoClose: true, // Enable auto-close
      autoCloseDelay: 10000, // 10 seconds
      onAction: async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Confirmar info");
      },
    });
  }

  // Warning without auto-close (default)
  openAlertWarning() {
    this.alertToastService.AlertToast({
      type: "warning",
      title: "Warning inesperado",
      description: "Descripcion de warning. Sin auto-cierre (por defecto).",
      // onAction: async () => {
      //   await new Promise(resolve => setTimeout(resolve, 2000));
      //   console.log("Confirmar warning");
      // },
      // autoClose is false by default for non-success toasts
    });
  }

  // Question with auto-close
  openAlertQuestion() {
    this.alertToastService.AlertToast({
      type: "question",
      title: "Question con auto-cierre",
      description: "Este toast se cerrará en 8 segundos.",
      autoClose: true,
      autoCloseDelay: 8000, // 8 seconds
      onAction: async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Confirmar question");
      },
      onCancel: async () => {
        console.log("Cancelar question");
      },
    });
  }

  // Error without auto-close (default)
  openAlertError() {
    this.alertToastService.AlertToast({
      type: "error",
      title: "Error inesperado",
      description: "Descripcion de error. Sin auto-cierre (por defecto).",
      onAction: async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Confirmar error");
      },
    });
  }

  // Loading with auto-close
  openAlertLoading() {
    this.alertToastService.AlertToast({
      type: "loading",
      title: "Loading con auto-cierre",
      description: "Este toast se cerrará en 3 segundos.",
      autoClose: true,
      autoCloseDelay: 3000, // 3 seconds
      onCancel: async () => {
        console.log("Cancelar loading");
      },
    });
  }
}