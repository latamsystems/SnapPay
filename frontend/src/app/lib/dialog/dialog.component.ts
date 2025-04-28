 
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
export class JDialogComponent {
  icons = {
    x: X
  };

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
  @Input() height: number | 'auto' = 300;
  @Input() overlay: boolean = true;
  @Input() draggable: boolean = false;

  private isDragging = false;
  private dragOffset = { x: 0, y: 0 };

  constructor() { }

  onOpen() {
    this.openModal = true;
  }

  onClose() {
    this.closeModal.emit();
  }

  getModalWidth(): string {
    return typeof this.width === 'number' ? `${this.width}px` : this.width;
  }

  getModalHeight(): string {
    if (this.height === 'auto') return 'auto';
    if (typeof this.height === 'number') return `${this.height}px`;
    return `${this.height || 40}px`;
  }

  @HostListener('document:keydown.escape', ['$event'])
  handleEscape(event: KeyboardEvent) {
    if (this.openModal) {
      this.onClose();
    }
  }

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

  getOffsetStyles(): { [key: string]: string } {
    return {
      marginTop: this.offset.top !== undefined ? `${this.offset.top}px` : '',
      marginBottom: this.offset.bottom !== undefined ? `${this.offset.bottom}px` : '',
      marginLeft: this.offset.left !== undefined ? `${this.offset.left}px` : '',
      marginRight: this.offset.right !== undefined ? `${this.offset.right}px` : '',
    };
  }

  startDrag(event: MouseEvent) {
    if (!this.draggable) return;

    this.isDragging = true;

    const dialogElement = (event.currentTarget as HTMLElement).closest('[data-draggable-dialog]') as HTMLElement;
    if (!dialogElement) return;

    const rect = dialogElement.getBoundingClientRect();
    this.dragOffset = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    dialogElement.style.position = 'fixed';
    dialogElement.style.margin = '0';
    dialogElement.style.transform = 'none';
    dialogElement.style.zIndex = '1001';

    const mouseMoveHandler = (moveEvent: MouseEvent) => {
      if (!this.isDragging) return;

      const newLeft = moveEvent.clientX - this.dragOffset.x;
      const newTop = moveEvent.clientY - this.dragOffset.y;

      // límites del viewport
      const maxLeft = window.innerWidth - dialogElement.offsetWidth;
      const maxTop = window.innerHeight - dialogElement.offsetHeight;

      // aplicar límites
      const boundedLeft = Math.min(Math.max(newLeft, 0), maxLeft);
      const boundedTop = Math.min(Math.max(newTop, 0), maxTop);

      dialogElement.style.left = `${boundedLeft}px`;
      dialogElement.style.top = `${boundedTop}px`;
    };

    const mouseUpHandler = () => {
      this.isDragging = false;
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  }


}
