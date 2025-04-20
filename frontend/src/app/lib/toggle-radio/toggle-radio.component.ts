import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GenericService } from '../crud/elements/crud-generic.service';
import { Loader2, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'JToggleRadio',
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './toggle-radio.component.html',
  styleUrl: './toggle-radio.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleRadioComponent),
      multi: true,
    },
  ],
})
export class ToggleRadioComponent implements OnInit, ControlValueAccessor {

  icons = {
    loading: Loader2,
  }

  @Input() options: any[] = [];
  @Input() optionLabel = 'label';  // Propiedad anidada para label
  @Input() optionValue = 'value';  // Propiedad para value
  @Input() endpoint: string = '';
  @Input() loadOnInit = false;
  @Input() defaultFilters: { [key: string]: any } = {};
  @Input() showClear = false;
  @Input() classes: string = '';
  @Input() classesElement: string = '';
  @Input() disabled: boolean = false;
  @Input() sort: 'ASC' | 'DESC' = 'ASC';
  @Input() selectFirstOnLoad: boolean = false;

  @Output() selectionChange = new EventEmitter<any>();

  internalOptions: { value: any; label: string }[] = [];
  selectedValue: any = null;
  isLoading = false;

  constructor(private readonly genericService: GenericService) { }

  ngOnInit(): void {
    if (this.endpoint && this.loadOnInit) {
      this.loadOptionsFromApi();
    } else {
      this.processOptions();
    }
  }

  isComponentDisabled = false;

  setDisabledState(isDisabled: boolean): void {
    this.isComponentDisabled = isDisabled;
  }

  // Cargar opciones desde el API
  loadOptionsFromApi() {
    this.isLoading = true;

    const params: any = {};
    params['sortOrder'] = this.sort;

    Object.keys(this.defaultFilters).forEach((key) => {
      params[`filter[${key}]`] = this.defaultFilters[key];
    });

    this.genericService.getAll<any>(this.endpoint, params).subscribe({
      next: (res) => {
        const data = res.data[this.endpoint] || [];
        this.options = data;
        this.processOptions();
        this.isLoading = false;

        // Si el parámetro selectFirstOnLoad es true, seleccionar el primer elemento
        if (this.selectFirstOnLoad && this.internalOptions.length > 0) {
          this.selectedValue = this.internalOptions[0].value;
          this.onChange(this.selectedValue);
          this.selectionChange.emit(this.selectedValue);
        }
      },
      error: () => (this.isLoading = false),
    });
  }


  // Función para obtener valores anidados de un objeto
  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj) ?? '';
  }

  // Procesar opciones para tener el valor y el label
  processOptions() {
    if (this.options.length > 0 && typeof this.options[0] === 'object') {
      this.internalOptions = this.options.map((opt) => ({
        value: opt[this.optionValue],
        label: this.getNestedValue(opt, this.optionLabel),  // Usar la función para obtener propiedades anidadas
      }));
    } else {
      this.internalOptions = this.options.map((opt) => ({
        value: opt,
        label: opt.toString(),
      }));
    }
  }

  select(value: any) {
    if (this.disabled || this.isComponentDisabled) return;
    this.selectedValue = value;
    this.onChange(this.selectedValue);
    this.selectionChange.emit(this.selectedValue);
  }

  clear() {
    this.selectedValue = null;
    this.onChange(null);
    this.selectionChange.emit(null);
  }

  // ControlValueAccessor
  onChange: any = () => { };
  onTouched: any = () => { };
  writeValue(value: any): void {
    this.selectedValue = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }




  // Método para recargar las opciones cuando cambia el filtro
  reloadOptions() {
    this.loadOptionsFromApi();  // Recargar las opciones con los nuevos filtros
  }
}
