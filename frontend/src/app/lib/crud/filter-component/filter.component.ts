import { Component, EventEmitter, Input, Output, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, X, Loader2, Cpu, Filter, Eraser, Check, Trash2, ArrowDownWideNarrow } from 'lucide-angular';
import { SelectComponent } from 'src/app/lib/select/select.component';
import { Subject, Subscription, debounceTime, filter } from 'rxjs';
import { ButtonComponent } from 'src/app/lib/button/button.component';
import { DialogModule } from "primeng/dialog"
import { FilterButton, FilterSelect } from './elements/filter.interface';
import { AlertToastService } from 'src/app/lib/alert-toast/elements/alert-toast.service';
import { LoadingState, TableColumn } from '../table-component/elements/table.interface';

@Component({
  selector: 'JFilter',
  standalone: true,
  imports: [LucideAngularModule, SelectComponent, ButtonComponent, FormsModule, DialogModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {

  // Lucide icons
  icons = {
    filter: Filter,
    filterList: ArrowDownWideNarrow,
    eraser: Eraser,
    transh: Trash2,
    check: Check,
    clear: X,
    search: Search,
    loading: Loader2,
    default: Cpu
  };

  @Input() isLoadingSearch: boolean = false;
  @Input() isLoadingPerPage: boolean = false;
  @Input() isLoadingAditionalButtons: { [key: string]: LoadingState } = {};

  @Input() searchPlaceholder: string = 'Buscar...';

  // Inputs
  @Input() columns: TableColumn<any>[] = [];
  @Input() itemsPerPageOptions: number[] = [];

  // Outputs
  @Output() search = new EventEmitter<void>();
  @Output() itemsPerPageChange = new EventEmitter<number>();
  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() onItemsPerPageChangeEvent = new EventEmitter<void>();
  @Output() clearFilters = new EventEmitter<string>();

  // Para el binding bidireccional de itemsPerPage
  private _itemsPerPage: number = 0;

  @Input() get itemsPerPage(): number {
    return this._itemsPerPage;
  }

  // Para el binding bidireccional de searchQuery
  private _searchQuery: string = '';

  @Input() get searchQuery(): string {
    return this._searchQuery;
  }

  // Para el debounce de la búsqueda
  private readonly searchSubject = new Subject<string>();
  private searchSubscription!: Subscription;
  private isInitialized: boolean = false;

  // Variables para estado de los filtros
  visibleFilter: boolean = false;
  positionFilter: any = 'left';

  // Configuración de botones
  @Input() filtersButton: FilterButton[] = [];

  // Filtros de tabla
  @Input() filtersSelect: FilterSelect[] = [];

  get visibleColumns(): TableColumn<any>[] {
    return this.columns.filter(col => !col.hidden);
  }
  
  constructor(
    private readonly alertToastService: AlertToastService,
    private readonly cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    // Configurar el debounce para la búsqueda después de la inicialización
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(1000), // 1 segundo de debounce
        filter(() => this.isInitialized) // Solo procesar si está inicializado
      )
      .subscribe(() => { this.onSearch(); });

    // Marcar como inicializado después de configurar la suscripción
    setTimeout(() => { this.isInitialized = true; }, 0);

    // Normalizar botones
    this.filtersButton = this.normalizeFilterButtons(this.filtersButton);
  }

  ngOnDestroy() {
    // Limpiar la suscripción al destruir el componente
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  // =====================================================
  // Bindings
  // =====================================================

  // Binding bidireccional de itemsPerPage
  set itemsPerPage(value: number) {
    this._itemsPerPage = value;
    this.itemsPerPageChange.emit(value);
  }

  // Binding bidireccional de searchQuery
  set searchQuery(value: string) {
    // Solo emitir eventos si el valor ha cambiado
    if (this._searchQuery !== value) {
      this._searchQuery = value;
      this.searchQueryChange.emit(value);

      // Solo emitir al subject si ya se ha inicializado el componente
      if (this.isInitialized) {
        this.searchSubject.next(value);
      }
    }
  }

  // =====================================================
  // Metodos
  // =====================================================

  // Buscar
  onSearch(): void {
    this.search.emit();
  }

  // Eliminar busqueda
  clearSearch(): void {
    this.searchQuery = '';
    this.onSearch();
  }

  // Mostrar items por pagina
  onItemsPerPageChange(): void {
    this.onItemsPerPageChangeEvent.emit();
  }

  // =====================================================
  // Filtros
  // =====================================================

  // Método para cerrar el diálogo de filtros
  closeFilterDialog(): void {
    this.visibleFilter = false;  // Oculta el filtro
    // this.updateButtonStates();  // Actualiza los estados de los botones
  }

  // =====================================================
  // Botones de filtro
  // =====================================================

  // Normaliza los botones de filtro
  normalizeFilterButtons(buttons: FilterButton[]): FilterButton[] {
    return buttons.map((button) => {

      // Si es un botón de filtro
      if (button.type === 'filter') {
        return {
          ...button,
          icon: this.icons.filter,
          iconChange: this.icons.filterList,
          isChangeIcon: () => this.visibleFilter,
          clicked: () => {
            this.visibleFilter = !this.visibleFilter;
          },
          classes: 'bg-[#20638f] hover:bg-[#1d5a82] text-white'
        };
      }

      // Si es un botón de limpiar
      if (button.type === 'clear') {
        return {
          ...button,
          icon: this.icons.eraser,
          iconChange: this.icons.transh,
          tooltip: 'Limpiar filtros',
          clicked: () => {
            const hasActiveSearch = this.searchQuery?.trim().length > 0;
            const hasSelectedFilters = this.filtersSelect.some(f => {
              const actual = f.selected;
              const inicial = f.initSelected ?? null;
              return JSON.stringify(actual) !== JSON.stringify(inicial);
            });

            if (!hasActiveSearch && !hasSelectedFilters) {
              this.alertToastService.AlertToast({
                type: 'info',
                title: 'No se ha filtrado nada...',
                description: 'No hay filtros activos para limpiar',
                autoClose: true
              })

              return;
            }

            // Limpiar búsqueda
            if (hasActiveSearch) {
              this.clearSearch();
            }

            // Limpiar selects
            for (const filter of this.filtersSelect) {
              const initial = filter.initSelected ?? null;
              const current = filter.selected;

              if (JSON.stringify(current) !== JSON.stringify(initial)) {
                filter.selected = initial;

                setTimeout(() => {
                  if (typeof filter.onSelected === 'function') {
                    filter.onSelected(initial);
                  }
                });
              }

            }
            this.clearFilters.emit('clear');
          },
          isChangeIcon: () => {
            const hasActiveSearch = this.searchQuery?.trim().length > 0;
            const hasSelectedFilters = this.filtersSelect.some(f => {
              const actual = f.selected;
              const inicial = f.initSelected ?? null;
              return JSON.stringify(actual) !== JSON.stringify(inicial);
            });
            return !hasActiveSearch && !hasSelectedFilters ? false : true;
          },
          classes: 'bg-[#164666] hover:bg-[#133d5a] text-white'
        };
      }

      // Podés extenderlo para otros tipos como 'clear', 'excel', etc.
      return button;
    });
  }

  // Manejar el click en un botón de filtro
  filterBottomClick(button: FilterButton): void {

    // Ejecuta la acción del padre si está definida
    if (button.clicked) {
      button.clicked();
    }

    this.isButtonLoading(button);
  }

  isButtonLoading(button: FilterButton): boolean {
    return button.type ? this.isLoadingAditionalButtons[button.type] === 'loading' : false;
  }

  // =====================================================
  // Acciones para validacion de un tipo a funcion
  // =====================================================

  // Obtener el ícono de un botón de filtro
  getIsChangeIcon(button: FilterButton): boolean {
    if (typeof button.isChangeIcon === 'function') {
      return button.isChangeIcon();
    }
    return button.isChangeIcon ?? false;
  }

  // Obtener el valor del tooltip de un botón
  getTooltip(button: FilterButton): string {
    if (typeof button.tooltip === 'function') {
      return button.tooltip(); // Puedes pasarle data si necesitas
    }
    return button.tooltip ?? '';
  }

  // Evaluar si un botón está deshabilitado
  getDisabled(button: FilterButton): boolean {
    if (typeof button.disabled === 'function') {
      return button.disabled();
    }
    return button.disabled ?? false;
  }

  // Evaluar si un botón es visible
  getIsVisible(button: FilterButton): boolean {
    if (typeof button.isVisible === 'function') {
      return button.isVisible();
    }
    // Si no se define, por defecto es visible
    return button.isVisible !== false;
  }
}