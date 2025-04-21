import { Component, Input, Output, EventEmitter, ContentChildren, QueryList, AfterContentInit, ElementRef, ViewChild, OnDestroy, ChangeDetectorRef, AfterViewInit, OnInit, SimpleChanges, OnChanges, input } from '@angular/core';
import { FormsModule, ControlValueAccessor, ReactiveFormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Eye, X, LucideAngularModule, ChevronDown, Check, Loader2, Search } from 'lucide-angular';
import { JButtonComponent } from '../button/button.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { OptionComponent } from './option/option.component';
import { TableColumn } from '../crud/table-component/elements/table.interface';
import { GenericService } from '../crud/elements/crud-generic.service';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'JSelect',
  standalone: true,
  imports: [LucideAngularModule, JButtonComponent, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  animations: [
    trigger("modalTransition", [
      transition(":enter", [
        style({ transform: "translateX(1rem)", opacity: 0 }),
        animate("300ms ease-out", style({ transform: "translateY(0)", opacity: 1 })),
      ]),
      transition(":leave", [
        animate("150ms ease-in", style({ transform: "translateX(1rem)", opacity: 0 })),
      ]),
    ]),
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: JSelectComponent,
      multi: true,
    }
  ]
})
export class JSelectComponent implements ControlValueAccessor, AfterContentInit, AfterViewInit, OnDestroy, OnInit, OnChanges {

  // Lucide icons
  icons = {
    chevronDown: ChevronDown,
    view: Eye,
    x: X,
    check: Check,
    search: Search, // xxx
    loading: Loader2,
  };

  @Input() type: 'multi-table' | 'dropdown' | 'searchable' = 'dropdown'; // Tipo de select
  @Input() btnIcon = this.icons.view; // Icono del botón
  @Input() btnText: string = '';  // Texto del botón

  @Input() title: string = 'Seleccionar'; // Titulo del dropdown
  @Input() placeholder: string = 'Seleccione una opción'; // Texto cuando no hay selección
  @Input() showClear: boolean = false; // Mostrar botón para limpiar selección

  @Input() columns: TableColumn<any>[] = []; // Columnas a mostrar en el dropdown ideal para la tabla

  @Input() options: any[] = []; // Opciones quemadas para el dropdown
  @Input() optionLabel: string | string[] = 'text'; // Propiedad a mostrar en el dropdown
  @Input() optionValue: string = 'value'; // Propiedad a usar como valor en el dropdown
  @Input() labelSeparator: string = ' ';

  @Input() isLoading: boolean = false;

  // Datos para el searchable
  @Input() endpoint: string = ''; // Endpoint para buscar datos
  @Input() loadOnInit: boolean = false; // Cargar datos al inicializar
  @Input() defaultFilters: { [key: string]: any } = {}; // Parámetros adicionales para la api
  @Input() searchFields: any[] = []; // Filtros adicionales para la búsqueda
  @Input() isSearch: boolean = true; // Habilitar la búsqueda
  @Input() isFilterSelect: boolean = false; // Es un select de filtro
  @Input() sort: 'ASC' | 'DESC' = 'ASC';

  @Output() updateVisibility = new EventEmitter<TableColumn<any>[]>();
  @Output() selectionChange = new EventEmitter<any>();

  @ContentChildren(OptionComponent) optionComponents!: QueryList<OptionComponent>;
  @ViewChild('selectButton') selectButton!: ElementRef;

  // Selectores
  isColumnSelectorOpen = false;
  selectedValue: any = null;
  selectedLabel: string = '';
  internalOptions: Array<{ value: any, text: string }> = [];

  // Para la búsqueda
  searchTerm: string = '';
  private readonly searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;
  filteredOptions: Array<{ value: any, text: string, original?: any }> = [];

  // Dropdown positioning
  dropdownTop = 0;
  dropdownLeft = 0;
  dropdownWidth = 0;

  // Para implementar ControlValueAccessor
  private onChange: any = () => { };
  private onTouched: any = () => { };
  @Input() disabled: boolean = false;

  // Para detectar clicks fuera del componente
  private clickOutsideListener: any;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly elementRef: ElementRef,
    private readonly genericService: GenericService
  ) { }

  ngOnInit() {
    // Configurar el debounce para la búsqueda
    this.searchSubscription = this.searchSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(() => {
      if (this.type === 'searchable') {
        this.loadData();
      }
    });

    // Cargar datos al inicializar si es necesario
    if (this.loadOnInit && this.type === 'searchable') {
      this.loadData();
    }

    // Asignar el texto del botón si no se ha proporcionado
    this.updateSelectedLabel();
  }


  ngAfterContentInit() {
    if (this.type === 'dropdown') {
      this.setupClickOutsideListener();
      this.optionComponents.changes.subscribe(() => {
        this.processOptions();
      });
    }
  }

  ngAfterViewInit() {
    this.setupClickOutsideListener();
    if (this.type === 'dropdown') {
      setTimeout(() => {
        this.processOptions();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.processOptions();
    }
  }

  ngOnDestroy() {
    if (this.clickOutsideListener) {
      document.removeEventListener('click', this.clickOutsideListener);
    }

    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  // ======================================================
  // Métodos
  // ======================================================

  // Método para procesar las opciones del dropdown
  processOptions() {
    this.internalOptions = [];
    if (this.optionComponents && this.optionComponents.length > 0) {
      this.optionComponents.forEach(option => {
        this.internalOptions.push({
          value: option.value,
          text: option.text || 'Option'
        });
      });
    } else if (this.options && this.options.length > 0 && typeof this.options[0] !== 'object') {
      this.internalOptions = this.options.map(option => ({
        value: option,
        text: option.toString()
      }));
    } else if (this.options && this.options.length > 0) {
      this.internalOptions = this.options.map(option => {
        const text = Array.isArray(this.optionLabel)
          ? this.optionLabel.map(k => this.getNestedValue(option, k)).join(' ')
          : this.getNestedValue(option, this.optionLabel);

        return {
          value: option[this.optionValue],
          text,
          original: option
        };
      });
    }

    this.filteredOptions = [...this.internalOptions];
    this.updateSelectedLabel();
    this.cdr.detectChanges();
  }

  // Actualizar la visibilidad de las columnas
  updateColumnVisibility() {
    if (this.type === 'multi-table') {
      this.updateVisibility.emit(this.columns);
    }
  }

  // Seleccionar una opción
  selectOption(option: { value: any, text: string, original?: any }) {
    this.selectedValue = option.value;
    this.selectedLabel = option.text;
    this.onChange(this.selectedValue);
    this.selectionChange.emit(option.original ?? option.value);
    this.isColumnSelectorOpen = false;
  }

  // Limpiar la selección
  clearSelection(event: Event) {
    event.stopPropagation();
    this.writeValue(null);
    this.onChange(null);
    this.selectionChange.emit(null);
  }

  // Limpier el término de búsqueda
  clearSearchTerm(): void {
    this.searchTerm = '';
    this.onSearchInput();
  }

  // Actualizar el texto del botón
  updateSelectedLabel() {
    if (this.selectedValue === null) {
      this.selectedLabel = this.placeholder;
      return;
    }
    const selectedOption = this.internalOptions.find(opt => opt.value === this.selectedValue);
    this.selectedLabel = selectedOption ? selectedOption.text : this.placeholder;
  }

  // Obtener el valor anidado de un objeto
  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj) ?? '';
  }

  // ======================================================
  // Search input service
  // ======================================================

  // Cargar datos desde el servicio
  loadData() {
    if (!this.endpoint) return;
    this.isLoading = true;

    const params: any = {};

    params['sortOrder'] = this.sort;

    // Aplicar los filtros predeterminados enviados desde el padre
    Object.keys(this.defaultFilters).forEach((key) => {
      params[`filter[${key}]`] = this.defaultFilters[key];
    });

    // Añadir término de búsqueda a los parámetros
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      params['search'] = this.searchTerm;

      // Aplicar filtros de búsqueda adicionales
      const allSearchFields = [this.optionLabel, ...this.searchFields];
      params['searchFields'] = allSearchFields;
    }

    // Esperar 2s
    // setTimeout(() => {
    this.genericService.getAll<any>(this.endpoint, params).subscribe({
      next: (response) => {
        // Procesar la respuesta según la estructura de tu API
        const data = response.data[this.endpoint] || [];
        this.options = data;

        // Procesar las opciones para el dropdown
        this.internalOptions = this.options.map(option => ({
          value: option[this.optionValue],
          text: this.resolveLabel(option),
          original: option
        }));

        this.filteredOptions = [...this.internalOptions];
        this.isLoading = false;
        this.updateSelectedLabel();
        this.cdr.detectChanges();

      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
    // }, 2000);
  }

  // Manejar la entrada de búsqueda
  onSearchInput() {
    if (this.type === 'searchable') {
      // Para el tipo searchable, enviar la búsqueda al servicio
      this.searchSubject.next(this.searchTerm);
    } else {
      // Para otros tipos, filtrar localmente
      this.filterOptions();
    }
  }

  // Filtrar opciones localmente
  filterOptions() {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredOptions = [...this.internalOptions];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredOptions = this.internalOptions.filter(option =>
      option.text.toLowerCase().includes(searchTermLower)
    );
  }

  resolveLabel(option: any): string {
    if (Array.isArray(this.optionLabel)) {
      return this.optionLabel
        .map((key) => this.getNestedValue(option, key))
        .filter(Boolean)
        .join(this.labelSeparator); // <-- usar separador personalizado
    }

    return this.getNestedValue(option, this.optionLabel);
  }


  // ======================================================
  // Elemento
  // ======================================================

  // Abrir o cerrar el dropdown
  toggleColumnSelector() {
    if (this.disabled) return;

    this.isColumnSelectorOpen = !this.isColumnSelectorOpen;
    if (this.isColumnSelectorOpen) {
      this.onTouched();
      this.updateDropdownPosition();

      // Cargar datos cuando se abre el dropdown si es de tipo searchable
      if (this.type === 'searchable' && !this.loadOnInit && this.shouldTriggerLoad()) {
        this.loadData();
      }

    }
  }

  // Detectar clicks fuera del componente
  setupClickOutsideListener() {
    this.clickOutsideListener = (event: MouseEvent) => {
      const clickedElement = event.target as HTMLElement;
      const isOutsideDropdown = !this.elementRef.nativeElement.contains(clickedElement);

      if (this.isColumnSelectorOpen && isOutsideDropdown) {
        this.isColumnSelectorOpen = false;
        this.cdr.detectChanges();
      }
    };
    document.addEventListener('click', this.clickOutsideListener);
  }

  // Obtener el ancho del botón
  getSelectButtonWidth(): string {
    if (this.selectButton) {
      const width = this.selectButton.nativeElement.offsetWidth;
      return `${width}px`;
    }
    return '250px'; // Default fallback width
  }

  // Actualizar la posición del dropdown
  updateDropdownPosition() {
    setTimeout(() => {
      if (!this.selectButton) return;

      // Get button position
      const button = this.selectButton.nativeElement;
      const buttonRect = button.getBoundingClientRect();

      // Find the closest form container or dialog
      let offsetParent: HTMLElement | null = this.selectButton.nativeElement;
      let isInSidebar = false;

      // Check if we're inside a sidebar form
      while (
        offsetParent &&
        !offsetParent.classList.contains("content_form") &&
        !offsetParent.classList.contains("p-dialog")
      ) {
        if (offsetParent.classList.contains("fixed") && offsetParent.classList.contains("right-0")) {
          isInSidebar = true;
          break;
        }
        offsetParent = offsetParent.parentElement;
      }

      // Get offsets based on container
      let offsetTop = 0;
      let offsetLeft = 0;

      if (
        isInSidebar ||
        (offsetParent &&
          (offsetParent.classList.contains("content_form") || offsetParent.classList.contains("p-dialog")))
      ) {
        offsetTop = offsetParent ? offsetParent.getBoundingClientRect().top : 0;
        offsetLeft = offsetParent ? offsetParent.getBoundingClientRect().left : 0;
      }

      // Position directly below the button by default
      this.dropdownTop = buttonRect.bottom - offsetTop;
      this.dropdownLeft = buttonRect.left - offsetLeft;
      this.dropdownWidth = buttonRect.width;

      this.cdr.detectChanges();

      // Wait for dropdown to be in DOM
      setTimeout(() => {
        // Get dropdown element
        const dropdown = this.elementRef.nativeElement.querySelector(".absolute.z-\\[100\\]");
        if (!dropdown) return;

        // First use fixed positioning to handle scroll position correctly
        dropdown.style.position = 'fixed';
        dropdown.style.top = buttonRect.bottom + 'px';
        dropdown.style.left = buttonRect.left + 'px';
        dropdown.style.width = buttonRect.width + 'px';
        dropdown.style.zIndex = '100';

        // Wait for dropdown to render with fixed positioning
        setTimeout(() => {
          // Get dropdown dimensions
          const dropdownRect = dropdown.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const documentWidth = document.documentElement.clientWidth;

          // Determine if we need to flip or adjust position
          let newFixedTop = buttonRect.bottom;
          let newFixedLeft = buttonRect.left;

          // Check if dropdown goes below viewport and flip it if needed
          if (buttonRect.bottom + dropdownRect.height > viewportHeight) {
            newFixedTop = buttonRect.top - dropdownRect.height;
          }

          // Check if dropdown goes beyond right edge
          if (buttonRect.left + dropdownRect.width > documentWidth) {
            newFixedLeft = buttonRect.left - dropdownRect.width + buttonRect.width;
            if (newFixedLeft < 0) {
              newFixedLeft = 5;
              if (dropdownRect.width > documentWidth) {
                dropdown.classList.add("constrain-width");
              }
            }
          }

          // Apply adjusted fixed position
          dropdown.style.top = newFixedTop - 5 + 'px';
          dropdown.style.left = newFixedLeft - 15 + 'px';

          // Es boton de filtro
          if (this.isFilterSelect) {
            setTimeout(() => {
              // Calculate absolute position based on the current fixed position
              let newAbsoluteTop;
              let newAbsoluteLeft;

              if (newFixedTop === buttonRect.bottom) {
                // Dropdown is below the button
                newAbsoluteTop = this.dropdownTop;
              } else {
                // Dropdown is above the button (flipped)
                newAbsoluteTop = buttonRect.top - dropdownRect.height - offsetTop;
              }

              if (newFixedLeft === buttonRect.left) {
                // Dropdown is aligned with left edge of button
                newAbsoluteLeft = this.dropdownLeft;
              } else if (newFixedLeft === buttonRect.left - dropdownRect.width + buttonRect.width) {
                // Dropdown is aligned with right edge of button
                newAbsoluteLeft = buttonRect.left - dropdownRect.width + buttonRect.width - offsetLeft;
              } else {
                // Dropdown is at a fixed position from left edge
                newAbsoluteLeft = newFixedLeft;
              }

              // Switch to absolute positioning
              dropdown.style.position = 'absolute';
              dropdown.style.top = newAbsoluteTop + 'px';
              dropdown.style.left = newAbsoluteLeft - 2 + 'px';

              // Update internal state
              this.dropdownTop = newAbsoluteTop;
              this.dropdownLeft = newAbsoluteLeft;
              this.cdr.detectChanges();
            }, 0);
          } else {
            // After positioning is done, switch to absolute positioning
            setTimeout(() => {
              // Get the current visual position of the dropdown (relative to viewport)
              const dropdownRect = dropdown.getBoundingClientRect();

              // Find the dropdown's offset parent for absolute positioning
              const dropdownOffsetParent = this.findPositionedParent(dropdown) || document.body;
              const parentRect = dropdownOffsetParent.getBoundingClientRect();

              // Calculate absolute position that will maintain the same visual position
              // Absolute positioning is relative to the offset parent
              const absoluteTop = dropdownRect.top - parentRect.top + dropdownOffsetParent.scrollTop;
              const absoluteLeft = dropdownRect.left - parentRect.left + dropdownOffsetParent.scrollLeft;

              // Switch to absolute positioning with calculated coordinates
              dropdown.style.position = 'absolute';
              dropdown.style.top = absoluteTop + 'px';
              dropdown.style.left = absoluteLeft + 'px';

              // Update internal state
              this.dropdownTop = absoluteTop;
              this.dropdownLeft = absoluteLeft;
              this.cdr.detectChanges();
            }, 0);
          }



        }, 0);
      }, 0);
    });
  }

  // Helper method to find the offset parent for absolute positioning
  private findPositionedParent(element: HTMLElement): HTMLElement | null {
    if (!element) return null;

    let parent = element.parentElement;

    while (parent) {
      const position = window.getComputedStyle(parent).position;
      if (position === 'relative' || position === 'absolute' || position === 'fixed') {
        return parent;
      }
      parent = parent.parentElement;
    }

    return document.body; // Default to body if no positioned parent found
  }
  // Leer el valor seleccionado
  writeValue(value: any): void {
    this.selectedValue = value;

    // Si las opciones ya están cargadas, intenta mostrar el label ahora mismo
    if (this.internalOptions.length > 0) {
      this.updateSelectedLabel();
    }

    // Si no hay opciones cargadas aún, espera a que se carguen en loadData()
    this.cdr.markForCheck();
  }


  // ================================================
  // Registrar cambios
  // ================================================

  // Registrar el cambio del valor seleccionado
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Registrar el evento de tocar
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Cargar elementos del searhable cuando es necesario
  private shouldTriggerLoad(): boolean {
    const isSearchActive = this.searchTerm && this.searchTerm.trim() !== '';
    const isInitialState = this.selectedValue === null;
    return isSearchActive || isInitialState;
  }

}
