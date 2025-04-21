import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, HostListener, Input, Output, TemplateRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JButtonComponent } from 'src/app/lib/button/button.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { Asterisk, CircleX, Info, LucideAngularModule, Save, X } from 'lucide-angular';
import { JCheckboxComponent } from 'src/app/lib/checkbox/checkbox.component';
import { JTooltipModule } from '../../tooltip/tooltip.directive';

export type FormType = 'none' | 'create' | 'update';

export interface DynamicCheckbox {
  title: string;
  isChecked: boolean;
  isLoading?: boolean;
  isVisible?: boolean;
  onClick: (checked: boolean, index: number) => void;
}


@Component({
  selector: 'JCrudForm',
  standalone: true,
  imports: [LucideAngularModule, JButtonComponent, JTooltipModule, ReactiveFormsModule, FormsModule, CommonModule, JCheckboxComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  animations: [
    trigger('sidebarTransition', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class JFormComponent {

  icons = {
    x: X,
    save: Save,
    circleX: CircleX,
    info: Info,
    asterisk: Asterisk
  };

  @Input() formTemplate!: TemplateRef<any>;
  @Output() submitForm = new EventEmitter<void>();

  // Mostrar formulario lateral
  @Input() openForm: boolean = false;
  @Output() closeForm = new EventEmitter<void>();

  @Input() typeForm: FormType = 'none';
  titleForm: string = 'REGISTRO';
  @Input() isLoading: boolean = false;

  @Input() checkboxes: DynamicCheckbox[] = [];
  
  constructor() { }

  onSubmit() {
    this.submitForm.emit()
  }

  onClose() {
    this.closeForm.emit()
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    if (this.openForm) {
      this.onClose();
    }
  }
}
