import { Component } from '@angular/core';
import { ButtonComponent } from 'src/app/lib/button/button.component';
import { AlertDialogService } from 'src/app/lib/alert-dialog/elements/alert-dialog.service';

@Component({
  selector: 'app-alert-dialog-example',
  imports: [ButtonComponent],
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss'
})
export class AlertDialogExampleComponent {

  constructor(private readonly alertDialogService: AlertDialogService) { }

  // Success
  openAlertSuccess() {
    this.alertDialogService.AlertDialog({
      type: "success",
      title: "Success inesperado",
      description: "Descripcion de success.",
      onConfirm: async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Confirmar success");
      },
    });
  }

  // Info
  openAlertInfo() {
    this.alertDialogService.AlertDialog({
      type: "info",
      title: "Info inesperado",
      description: "Descripcion de info.",
      onConfirm: async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Confirmar info");
      },
      onCancel: async () => {
        // await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Cancelar info");
      },
    })
  }

  // Warning
  openAlertWarning() {
    this.alertDialogService.AlertDialog({
      type: "warning",
      title: "Warning inesperado",
      description: "Descripcion de warning.",
      onConfirm: async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Confirmar warning");
      },
      onCancel: async () => {
        // await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Cancelar warning");
      },
    })
  }

  // Question
  openAlertQuestion() {
    this.alertDialogService.AlertDialog({
      type: "question",
      title: "Question inesperado",
      description: "Descripcion de question.",
      onConfirm: async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Confirmar question");
      },
      onCancel: async () => {
        // await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Cancelar question");
      },
    })
  }

  // Error
  openAlertError() {
    this.alertDialogService.AlertDialog({
      type: "error",
      title: "Error inesperado",
      description: "Descripcion de error.",
      onConfirm: async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Confirmar error");
      },
      onCancel: async () => {
        // await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Cancelar error");
      },
      onRetry: async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Retry error");
      },
    })
  }

  // Loading
  openAlertLoading() {
    this.alertDialogService.AlertDialog({
      type: "loading",
      title: "Loading inesperado",
      description: "Descripcion de loading.",
      onCancel: async () => {
        // await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("Cancelar loading");
      },
    })
  }
}
