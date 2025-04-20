import { Component, Input, TemplateRef, CUSTOM_ELEMENTS_SCHEMA, Output, EventEmitter, HostListener } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { LucideAngularModule, X } from 'lucide-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'JDialog',
  standalone: true,
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  animations: [
    trigger('modalTransition', [
      transition(':enter', [
        style({ transform: 'translateY(1rem)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ transform: 'translateY(1rem)', opacity: 0 }))
      ])
    ])
  ]
})
export class DialogComponent {

  icons = {
    x: X
  }

  @Input() position: 
  | 'center'
  | 'leftCenter'
  | 'rightCenter'
  | 'topCenter'
  | 'bottomCenter'
  | 'leftTop'
  | 'leftBottom'
  | 'rightTop'
  | 'rightBottom' = 'center';
  @Input() offset: { top?: number, bottom?: number, left?: number, right?: number } = {};


  @Input() openModal = false;
  @Output() closeModal = new EventEmitter<void>();

  @Input() dialogTemplate!: TemplateRef<any>;
  @Input() title = 'Dialog Title';
  @Input() width: number = 500;
  @Input() height: number = 300;

  constructor() { }

  onOpen() {
    this.openModal = true;
  }

  onClose() {
    this.closeModal.emit()
  }

  // Devuelve un string con unidad (px o %)
  getModalWidth(): string {
    if (typeof this.width === 'number') {
      return `${this.width}px`;
    }
    return this.width;
  }

  // Devuelve un string con unidad (px o %)
  getModalHeight(): string {
    if (typeof this.height === 'number') {
      return `${this.height}px`;
    }
    return this.height;
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    if (this.openModal) {
      this.onClose();
    }
  }

  // Agrega posisionamiento al al modal
  getPositionClass(): string {
    switch (this.position) {
      case 'leftCenter': return 'justify-start items-center';
      case 'rightCenter': return 'justify-end items-center';
      case 'topCenter': return 'justify-center items-start';
      case 'bottomCenter': return 'justify-center items-end';
      case 'leftTop': return 'justify-start items-start';
      case 'leftBottom': return 'justify-start items-end';
      case 'rightTop': return 'justify-end items-start';
      case 'rightBottom': return 'justify-end items-end';
      case 'center':
      default: return 'justify-center items-center';
    }
  }

  // Agrega offsets a los estilos del modal
  getOffsetStyles(): { [key: string]: string } {
    return {
      marginTop: this.offset.top !== undefined ? `${this.offset.top}px` : '',
      marginBottom: this.offset.bottom !== undefined ? `${this.offset.bottom}px` : '',
      marginLeft: this.offset.left !== undefined ? `${this.offset.left}px` : '',
      marginRight: this.offset.right !== undefined ? `${this.offset.right}px` : '',
    };
  }
}
