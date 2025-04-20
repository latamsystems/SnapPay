import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'JErrorMessage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.scss'
})
export class ErrorMessageComponent {
  @Input() control!: AbstractControl | null;
  @Input() errorMessages: { [key: string]: string } = {};
  @Input() classes: string = '';

  get hasErrors(): boolean {
    return !!this.control && this.control.invalid && this.control.touched;
  }

  get errors(): string[] {
    if (!this.control || !this.control.errors) return [];
    return Object.keys(this.control.errors)
      .filter(errorKey => this.errorMessages[errorKey])
      .map(errorKey => this.errorMessages[errorKey]);
  }
}
