 
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


import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Check, Loader2, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'JCheckbox',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss'
})
export class JCheckboxComponent {

  // Lucide icons
  icons = {
    check: Check,
    loading: Loader2,
  };

  @Input() type: 'checkbox' | 'switch' = 'checkbox';
  @Input() icon: any = this.icons.check; // Default icon
  @Input() iconSize: number = 15; // Default icon size
  @Input() disabled?: boolean; // Desactivar el checkbox
  @Input() isLoading?: boolean; // Indicar que el checkbox esta cargando
  @Input() classes: string = ''; // Clases adicionales para el checkbox

  @Input() title!: string; // titulo del checkbox
  @Input() isChecked: boolean = false; // Estado del checkbox
  
  @Input() item: any;
  @Input() column: any;
  
  // Funciones
  @Input() getValue: (item: any, column: any) => boolean = () => false;
  @Input() onCheckboxChange: (item: any, column: any) => void = () => { };

  @Input() toggleSwitch: (isChecked: boolean) => void = () => { };
}