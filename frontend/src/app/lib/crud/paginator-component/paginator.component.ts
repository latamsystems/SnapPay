 
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


import { Component, Input, Output, EventEmitter } from '@angular/core';
import { JButtonComponent } from 'src/app/lib/button/button.component';
import {
  LucideAngularModule,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from 'lucide-angular';

@Component({
  selector: 'JPaginator',
  imports: [LucideAngularModule, JButtonComponent],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class JPaginatorComponent {

  Math = Math;

  // Lucide icons
  icons = {
    firstPage: ChevronsLeft,
    prevPage: ChevronLeft,
    nextPage: ChevronRight,
    lastPage: ChevronsRight,
  };

  @Input() isLoading = false;

  // Para rastrear qué botón está siendo cargado
  loadingButton: 'first' | 'prev' | 'next' | 'last' | number | null = null;

  // Paginacion
  @Input() currentPage = 1;
  @Input() itemsPerPageOptions = [10];
  @Input() itemsPerPage = this.itemsPerPageOptions[0];
  @Input() totalItems = 0;


  // Paginas a mostrar
  @Input() pages: number[] = [];

  // Eventos de salida
  @Output() pageChange = new EventEmitter<number>();

  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get endIndex(): number {
    return Math.min(this.startIndex + this.itemsPerPage - 1, this.totalItems - 1);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.loadingButton = page;
      this.currentPage = page;
      this.pageChange.emit(this.currentPage);
    }
  }

  goToFirstPage() {
    if (!this.isLoading && this.currentPage !== 1) {
      this.loadingButton = 'first';
      this.onPageChange(1);
    }
  }

  goToPreviousPage() {
    if (!this.isLoading && this.currentPage > 1) {
      this.loadingButton = 'prev';
      this.onPageChange(this.currentPage - 1);
    }
  }

  goToNextPage() {
    if (!this.isLoading && this.currentPage < this.totalPages) {
      this.loadingButton = 'next';
      this.onPageChange(this.currentPage + 1);
    }
  }

  goToLastPage() {
    if (!this.isLoading && this.currentPage !== this.totalPages) {
      this.loadingButton = 'last';
      this.onPageChange(this.totalPages);
    }
  }

  // Verificar si un botón específico está cargando
  isButtonLoading(button: 'first' | 'prev' | 'next' | 'last' | number): boolean {
    return this.isLoading && this.loadingButton === button;
  }
}