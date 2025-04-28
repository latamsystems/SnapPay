 
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


import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'JContentForm',
  imports: [NgClass],
  templateUrl: './content-form.component.html',
  styleUrl: './content-form.component.scss'
})
export class JContentFormComponent {
  @Input() columns: number = 1;
  @Input() rows: boolean = false;

  getClasses(): string {
    if (this.rows) return 'flex flex-row gap-3 items-center';
  
    const base = 'grid gap-2';
    const columnClassMap: { [key: number]: string } = {
      1: 'flex flex-col gap-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-4',
      5: 'grid-cols-1 sm:grid-cols-5',
      6: 'grid-cols-1 sm:grid-cols-6',
    };
  
    return `${base} ${columnClassMap[this.columns] || columnClassMap[1]}`;
  }
  
  
}
