import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonComponent } from 'src/app/lib/button/button.component';
import {
  LucideAngularModule,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from 'lucide-angular';

@Component({
  selector: 'JPaginator',
  imports: [LucideAngularModule, ButtonComponent],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent {

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