 
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


import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'JOption',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-content></ng-content>`,
  styles: []
})
export class OptionComponent implements AfterViewInit {
  @Input() value: any;
  @Input() disabled = false;

  // Used internally by JSelect
  @HostBinding('attr.data-value')
  get dataValue() {
    return this.value;
  }

  // Store the text content for display in the select
  private _text = '';
  
  public get text(): string {
    return this._text;
  }

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    // Extract text content after view is initialized
    this._text = this.elementRef.nativeElement.textContent.trim();
  }

  // This will be called by JSelect to set the text content
  setTextContent(text: string) {
    this._text = text;
  }
}