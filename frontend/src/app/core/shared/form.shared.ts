// src/app/core/shared/form.shared.ts
import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Ban, CircleCheckBig, Cpu, Edit, KeyRound, MousePointerClick, Plus, Power, Trash, UserRoundSearch } from 'lucide-angular';
import { AlertToastService } from 'src/app/lib/alert-toast/elements/alert-toast.service';
import { FormType } from 'src/app/lib/crud/form-component/form.component';

@Injectable({
  providedIn: 'root'
})
export class FormShared {

  icons = {
    add: Plus,
    edit: Edit,
    delete: Trash,
    ban: Ban,
    power: Power,
    default: Cpu,
    keyRound: KeyRound,
    userRoundSearch: UserRoundSearch,
    circleCheckBig: CircleCheckBig,
    mousePointerClick: MousePointerClick,
  };

  // Resetear formulario
  onResetCallback: (() => void) | null = null;

  isLoading: boolean = false;
  openForm: boolean = false;
  typeForm: FormType = 'create';

  formControls: { [key: string]: AbstractControl | null } = {};
  messages: { title: string, description: string } | null = null;

  constructor(
    private readonly alertToastService: AlertToastService,
  ) { }

  onOpen() {
    this.openForm = true;
    if (this.onResetCallback) {
      this.onResetCallback();
    }
  }

  onClose() {
    this.openForm = false;
  }

  onValidateChange(validation: boolean): boolean {
    if (validation) {
      this.alertToastService.AlertToast({
        type: "info",
        title: "Sin cambios...",
        description: "No se han realizado cambios en el formulario"
      })
      return true;
    }
    return false;
  }

  onTableDataLoaded() {
    this.isLoading = false;
    this.openForm = false;

    if (this.messages) {
      this.alertToastService.AlertToast({
        type: "success",
        ...this.messages
      });

      this.messages = null;
    }
  }

}
