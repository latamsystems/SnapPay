 
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


import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, ChevronUp, ChevronDown, Eye, Edit, Trash, Search, ChevronsUpDown, Check, Loader2, ChevronLeft, ChevronRight } from 'lucide-angular';
import { GenericService } from '../../crud/elements/crud-generic.service';
import { Params } from '@angular/router';
import { JButtonComponent } from '../../button/button.component';
import { LoadingState, LoadingStates, OptionsTable, SortDirection, TableColumn } from './elements/table.interface';
import { AlertToastService } from '../../alert-toast/elements/alert-toast.service';
import { JCheckboxComponent } from "../../checkbox/checkbox.component";
import { ConverterService } from '../elements/converter.service';
import { CalendarService } from 'src/app/core/services/static/transformer/calendar.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { JPaginatorComponent } from '../paginator-component/paginator.component';
import { JFilterComponent } from '../filter-component/filter.component';
import { FilterButton, FilterSelect } from '../filter-component/elements/filter.interface';

@Component({
  selector: 'JCrudTable',
  standalone: true,
  imports: [CommonModule, FormsModule, JPaginatorComponent, JFilterComponent, LucideAngularModule, JButtonComponent, JCheckboxComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  animations: [
    trigger('slideToggle', [
      state('collapsed', style({
        height: '0',
        opacity: 0,
        overflow: 'hidden',
      })),
      state('expanded', style({
        height: '*',
        opacity: 1,
      })),
      transition('collapsed <=> expanded', [
        animate('0.3s ease-in-out')
      ])
    ])
  ]


})
export class JTableComponent implements OnInit {

  Math = Math;

  // Estados de carga
  @Output() dataLoaded = new EventEmitter<void>();
  loadingStates: LoadingStates = {
    initialLoad: 'idle',
    search: 'idle',
    itemsPerPage: 'idle',
    pagination: 'idle',
    sort: 'idle',
    aditionalButtons: {},
    checked: 'idle',
    action: 'idle',
  };

  // Lucide icons
  icons = {
    sortDefault: ChevronsUpDown,
    sortAsc: ChevronUp,
    sortDesc: ChevronDown,
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight,
    view: Eye,
    edit: Edit,
    delete: Trash,
    search: Search,
    check: Check,
    loading: Loader2
  };

  @Input() endpoint!: string;
  mainEndpoint!: string;
  @Input() columns: TableColumn<any>[] = [];
  @Input() defaultFilters: { [key: string]: any } = {};
  @Input() isPaginator = true;
  @Input() isSearch = true;

  data: any[] = [];

  // Expansion 
  expandTemplate?: (row: any) => string;
  expandedRows: Set<any> = new Set();

  // Pagination
  currentPage = 1;
  @Input() itemsPerPageOptions = [10, 25, 50, 100];
  itemsPerPage = this.itemsPerPageOptions[0];
  totalItems = 0;

  // Sorting
  sortColumn: string | null = null;
  sortDirection: SortDirection = 'none';
  sortingColumn: string | null = null;

  // Search
  searchQuery = '';
  @Input() searchPlaceholder = 'Buscar...';

  // Filters
  filters: any = {};

  // Datos filtrados y paginados
  displayData: any[] = [];

  // Pagination display
  pages: number[] = [];

  // Check
  @Input() checked: boolean = false;
  @Input() checkedValues: any[][] = [[true], [false]];
  @Input() checkedTitles: string[] = ["Activos", "Inactivos"];
  isChecked!: boolean;
  titleChecked!: string;

  // Propiedades calculadas para su visualización
  get startIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  // Configuración de botones
  @Input() filtersButton: FilterButton[] = [];

  // Filtros de tabla
  @Input() filtersSelect: FilterSelect[] = [];

  // Opciones de botones
  @Input() optionsTable: OptionsTable[] = [];

  constructor(
    private readonly crudService: GenericService,
    private readonly currencyPipe: CurrencyPipe,
    private readonly genericService: GenericService,
    private readonly alertToastService: AlertToastService,
    private readonly converterService: ConverterService,
    private readonly calendarService: CalendarService,
  ) { }

  ngOnInit() {
    this.mainEndpoint = this.endpoint.split('/').pop() ?? this.endpoint;
    this.isChecked = this.checkedValues[0][0];
    this.titleChecked = this.checkedTitles[0];
    this.columnDefaults();
    this.loadData();
    this.overrideFilterEvents();
  }

  overrideFilterEvents() {
    for (const filter of this.filtersSelect) {
      if (filter.type === 'dropdown' || filter.type === 'searchable') {
        const key = filter.optionValue ?? 'value';
        const deepKey = filter.deep ? `${filter.deep}.${key}` : key;

        const originalOnSelected = filter.onSelected;

        filter.onSelected = (value: any) => {
          const selectedValue = value?.[key] ?? value;

          if (selectedValue === null || selectedValue === undefined) {
            delete this.filters[deepKey];
          } else {
            this.filters[deepKey] = selectedValue;
          }

          // Llama al original
          if (typeof originalOnSelected === 'function') {
            originalOnSelected(value);
          }

          this.loadData('search');
        };
      }
    }
  }

  // =====================================================
  // Obtener datos
  // =====================================================

  // Cargar datos desde el servidor
  loadData(loadingType: keyof LoadingStates = 'initialLoad', onFinally?: () => void) {
    this.setLoadingState(loadingType, 'loading');

    const params = this.getQueryParams();

    // Simulando espera de API
    // setTimeout(() => {
    this.crudService.getAll<any>(this.endpoint, params).subscribe({
      next: (response) => {
        console.log('Data loaded:', response);

        this.data = response.data[this.mainEndpoint] ?? [];

        if (response.meta?.page) {
          this.totalItems = response.meta.page.totalRecords;
          this.currentPage = response.meta.page.currentPage;
        } else {
          this.totalItems = this.data.length;
        }

        if (response.meta?.sort) {
          this.sortColumn = response.meta.sort.by;
          this.sortDirection = response.meta.sort.order.toLowerCase() as SortDirection;
        }

        this.updateDisplayData();
        this.generatePagination();
        this.setLoadingState(loadingType, 'success');
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.setLoadingState(loadingType, 'error');
      }
    }).add(() => {
      this.dataLoaded.emit();
      if (loadingType === 'sort') {
        this.sortingColumn = null;
      }

      // Llamar al callback si fue proporcionado
      if (onFinally) {
        onFinally();
      }
    });
    // }, 2000);
  }

  // Actualizar los datos que se muestran en la tabla
  updateDisplayData() {
    this.displayData = this.data;
  }

  // =====================================================
  // Cambiar estado en campos booleanos
  // =====================================================

  // Método para cambiar el estado de un checkbox
  onCheckboxChange(item: any, column: TableColumn<any>) {
    // Get the ID field name based on dataProperty
    const idField = `id_${this.mainEndpoint}`;

    // Get the record ID
    const recordId = item[idField];

    // Get the current boolean value
    const currentValue = this.getValue(item, column);

    // Actualizar estado
    this.genericService.enable<any>(this.endpoint, recordId, { [column.key]: !currentValue }).subscribe({
      next: (response) => {
        item[column.key] = !currentValue;

        this.alertToastService.AlertToast({
          type: "success",
          title: "Registro actualizado!",
          description: response.msg,
        });
      }
    })
  }

  // Cambiar activos o inactivos
  checkActiveInactive(isChecked: boolean): void {
    this.isChecked = !isChecked;

    const index = this.isChecked ? 0 : 1;
    this.titleChecked = this.checkedTitles[index];

    // SOLO actualizamos la propiedad id_status sin tocar los demás filtros
    this.filters['id_status'] = this.checkedValues[index];

    this.filtersSelect = this.filtersSelect.map(filter => {
      if ('optionValue' in filter && filter.optionValue === 'id_status') {
        return {
          ...filter,
          defaultFilters: {
            ...(filter.hasOwnProperty('defaultFilters') ? (filter as any).defaultFilters : {}),
            id_status: this.filters['id_status']
          },
          selected: null // limpia la selección previa para forzar el reload
        };
      }
      return filter;
    });

    this.currentPage = 1;
    this.loadData('checked');
  }

  // Eliminar filtros
  onClearFilters(buttonType: string): void {
    this.setAditionalButtonLoading(buttonType);

    this.loadData('initialLoad', () => {
      this.clearAditionalButtonLoading(buttonType);
    });
  }

  // =====================================================
  // Columnas
  // =====================================================

  // Valores por defecto de las columnas
  columnDefaults() {
    // Valores por defecto de las columnas
    this.columns.forEach(column => {
      if (column.visible === undefined) {
        column.visible = true;
      }

      if (column.sortable === undefined) {
        column.sortable = true;
      }

      if (column.isSearchable === undefined) {
        column.isSearchable = true;
      }
    });
  }

  // Obtener el recuento de columnas visibles para colspan en estado vacío
  getVisibleColumnsCount(): number {
    return this.columns.filter(col => col.visible).length;
  }

  // =====================================================
  // Prosesamiento de datos
  // =====================================================

  // Obtener el valor de las celdas para identificar un campo booleano
  isBoolean(value: any): boolean {
    return typeof value === 'boolean';
  }

  // Método para obtener el valor de las celdas dinámicamente
  getValue(item: any, column: TableColumn<any>): any {
    let value: any;

    // Si existe un valueGetter, se usa directamente
    if (typeof column.valueGetter === 'function') {
      value = column.valueGetter(item);
    } else {
      // Si no, se busca el valor por key (con soporte para claves anidadas)
      const keys = column.key.split('.');
      value = item;

      for (const key of keys) {
        if (value != null) {
          value = value[key];
        } else {
          value = null;
          break;
        }
      }
    }

    // Si value es null o undefined, retornar 'S/N'
    if (value === null || value === undefined) {
      return 'S/N';
    }

    // Aplicar formato según configuración de columna
    const formatted = this.formatData(value, column);

    // Si formatData no devuelve nada (valor no formateado), devolver el valor original
    return formatted ?? value;
  }

  // Formatear datos para la tabla
  formatData(value: any, column: TableColumn<any>): any {

    // Añadir formato de moneda pero solo con el simbolo de $
    if (column.isdollar && value !== null) {
      const transformedValue = this.currencyPipe.transform(value, 'USD', 'symbol', '1.2-2');
      return transformedValue ? transformedValue.replace('US', '') : null;
    }

    if (column.isCurrency && value !== null) {
      return this.currencyPipe.transform(value, 'USD', 'symbol', '1.2-2');
    }

    if (column.isDate && value !== null) {
      return new Date(value).toLocaleDateString();
    }

    if (column.isDateText && value !== null) {
      return this.calendarService.formatearFechaString(`${value}`);
    }

    if (column.isDateTime && value !== null) {
      return new Date(value).toLocaleString();
    }

    if (column.isDateTimeText && value !== null) {
      return new Date(value).toString();
    }

    // Si no se aplica ningún formato, retornar el valor original
    return value;
  }


  // =====================================================
  // Parametros de busqueda
  // =====================================================

  // Obtener los parámetros de consulta para la solicitud de datos
  getQueryParams(): Params {
    const params: Params = this.genericService.params({
      page: this.currentPage,
      limit: this.itemsPerPage,
      sort: {
        column: this.sortColumn,
        direction: this.sortDirection,
      },
      filters: this.filters,
      defaultFilters: this.defaultFilters,
    });

    if (this.searchQuery && this.searchQuery.trim() !== '') {
      const baseSearchKeys = this.columns
        .filter(col => col.isSearchable)
        .map(col => col.key);

      const extraSearchKeys = this.columns
        .flatMap(col => col.extraSearchFields || []);

      const allSearchKeys = [...baseSearchKeys, ...extraSearchKeys];

      params['search'] = this.searchQuery;
      params['searchFields'] = allSearchKeys;
    }

    return params;
  }



  // =====================================================
  // Ordenamiento
  // =====================================================

  // Numero de pagina
  getRowNumber(index: number): number {
    return this.startIndex + index + 1;
  }

  // Ordenamiento de columnas
  onSort(column: TableColumn<any>) {
    // Evitar múltiples solicitudes de ordenamiento simultáneas
    if (this.isLoading('sort')) {
      return;
    }

    if (!column.sortable) return;

    // Guardar la columna que está siendo ordenada
    this.sortingColumn = column.key;

    // Verificamos si estamos tratando con la misma columna que el último ordenamiento
    const currentSortKey = this.converterService.getSortKey(this.sortColumn);
    const columnSortKey = this.converterService.getSortKey(column.key);

    // Sort direction logic
    if (currentSortKey === columnSortKey) {
      // Alternar la dirección del ordenamiento
      if (this.sortDirection === 'asc') {
        this.sortDirection = 'desc';
      } else if (this.sortDirection === 'desc') {
        this.sortDirection = 'none';
      } else {
        this.sortDirection = 'asc';
      }
    } else {
      // Si se selecciona una nueva columna para ordenar, iniciar con orden ascendente
      this.sortColumn = column.key;
      this.sortDirection = 'asc';
    }

    this.loadData('sort');
  }

  // Obtener la dirección de ordenamiento
  getSortKey(value: any): string {
    return this.converterService.getSortKey(value);
  }

  // Manejar el evento de tecla presionada en la ordenación
  onSortKeyPress(event: KeyboardEvent, column: TableColumn<any>) {
    // Si ya hay una ordenación en progreso, no permitir otra
    if (this.isLoading('sort')) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onSort(column);
    }
  }

  // =====================================================
  // Search
  // =====================================================

  // Search functionality
  onSearch() {
    this.currentPage = 1;
    this.loadData('search');
  }

  // Selector de items por página
  onItemsPerPageChange() {
    this.currentPage = 1;
    this.loadData('itemsPerPage');
  }

  // =====================================================
  // Paginator
  // =====================================================

  // Generar numeros de paginación
  generatePagination() {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;

    // Ver los 5 numeros de paginación
    const maxPagesToShow = 3;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    this.pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  // Paginar
  handlePageChange(page: number) {
    this.currentPage = page;
    this.loadData('pagination');
  }

  // =====================================================
  // Opciones
  // =====================================================

  // Método para manejar el clic de un botón
  onButtonClick(button: OptionsTable, element: any): void {
    // Ejecuta la acción del padre si está definida
    if (button.clicked) {
      button.clicked(element);
    }
  }

  // Método para obtener un tooltip
  getTooltip(tooltip: string | ((data?: any) => string), data: any): string {
    if (typeof tooltip === 'function') {
      return tooltip(data);
    }
    return tooltip ?? '';
  }

  // Método para obtener un icono
  getIcon(icon: ((data?: any) => any), data: any): any {
    if (typeof icon === 'function') {
      return icon(data);
    }
    return icon;
  }

  // Evaluar si un botón está deshabilitado
  getDisabled(option: OptionsTable, data: any): boolean {
    if (typeof option.disabled === 'function') {
      return option.disabled(data);
    }
    return !!option.disabled;
  }

  // Evaluar si un botón es visible
  getIsVisible(option: OptionsTable, data: any): boolean {
    if (typeof option.isVisible === 'function') {
      return option.isVisible(data);
    }
    // Si no se define, por defecto es visible
    return option.isVisible !== false;
  }

  // Método para obtener la clase CSS de un botón
  mergeNgClasses(optionNgClass: ((data?: any) => any), data: any): any {
    const baseClass = {
      'min-w-auto p-1! pl-2! pr-2!': true
    };

    let dynamicClass: any = {};
    if (typeof optionNgClass === 'function') {
      dynamicClass = optionNgClass(data);
    } else {
      dynamicClass = optionNgClass ?? {};
    }

    return {
      ...baseClass,
      ...(typeof dynamicClass === 'string' ? { [dynamicClass]: true } : dynamicClass)
    };
  }

  // =====================================================
  // Parametros de carga
  // =====================================================

  // Método para verificar si un estado específico está cargando
  isLoading(state: keyof LoadingStates): boolean {
    return this.loadingStates[state] === 'loading';
  }

  // Método para verificar si cualquier estado está cargando
  isAnyLoading(): boolean {
    return Object.values(this.loadingStates).some(state => state === 'loading');
  }

  // Método para actualizar un estado de carga
  setLoadingState(state: keyof LoadingStates, value: LoadingState | { [buttonType: string]: LoadingState }): void {
    if (state === 'aditionalButtons') {
      if (typeof value === 'string') {
        // Evita asignar un string directamente si se espera un objeto
        console.warn(`No puedes asignar '${value}' directamente a aditionalButtons. Usa setAditionalButtonLoading en su lugar.`);
      } else {
        this.loadingStates.aditionalButtons = value;
      }
    } else {
      this.loadingStates[state] = value as LoadingState;
    }
  }

  // Activar loading
  setAditionalButtonLoading(buttonType: string, id?: number | string): void {
    const key = id !== undefined ? `${buttonType}_${id}` : buttonType;
    this.loadingStates.aditionalButtons[key] = 'loading';
  }

  // Limpiar loading
  clearAditionalButtonLoading(buttonType: string, id?: number | string): void {
    const key = id !== undefined ? `${buttonType}_${id}` : buttonType;
    this.loadingStates.aditionalButtons[key] = 'idle';
  }

  // Verificar loading
  isAditionalButtonLoading(buttonType: string, id?: number | string): boolean {
    const key = id !== undefined ? `${buttonType}_${id}` : buttonType;
    return this.loadingStates.aditionalButtons[key] === 'loading';
  }

  // ==================================================
  // Expandir filas
  // ==================================================

  // Método para verificar si la tabla tiene filas expandibles
  hasExpandable(): boolean {
    return this.columns.some(col => typeof col.expandTemplate === 'function');
  }

  // Método para verificar si una fila está expandida
  toggleRow(row: any): void {
    if (this.expandedRows.has(row)) {
      this.expandedRows.delete(row);
    } else {
      this.expandedRows.add(row);
    }
  }

  // Método para obtener contenido expandido de una fila
  getExpandedContent(row: any): string {
    const expandableColumn = this.columns.find(col => typeof col.expandTemplate === 'function');
    return expandableColumn?.expandTemplate?.(row) ?? '';
  }

  // Método para obtener el estado de expansión de una fila
  getExpansionState(row: any): 'expanded' | 'collapsed' {
    return this.expandedRows.has(row) ? 'expanded' : 'collapsed';
  }

}