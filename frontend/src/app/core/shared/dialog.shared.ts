// src/app/core/shared/form.shared.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DialogShared {

  openDialog: boolean = false;

  constructor(
  ) { }

  onOpen() {
    this.openDialog = true;
  }

  onClose() {
    this.openDialog = false;
  }


}
