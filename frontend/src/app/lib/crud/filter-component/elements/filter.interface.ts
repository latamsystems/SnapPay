import { TableColumn } from "../../table-component/elements/table.interface";

// Botones de acciones generales
type CommonFilterButtonProps = {
  type?: 'filter' | 'clear' | 'excel' | 'pdf' | 'copy';
  icon?: any;
  clicked?: (data?: any) => void;
  classes?: string;
  tooltip?: ((data?: any) => string) | string;
  disabled?: ((data?: any) => boolean) | boolean;
  isVisible?: ((data?: any) => boolean) | boolean;
  tooltipPosition?: 'top' | 'right' | 'bottom' | 'left';
};

// Caso 1: Si `isChangeIcon` está definido, `iconChange` es requerido
type FilterButtonWithChangeIcon = CommonFilterButtonProps & {
  isChangeIcon: boolean | (() => boolean);
  iconChange: any;
};

// Caso 2: Si `isChangeIcon` no está definido, `iconChange` es opcional
type FilterButtonWithoutChangeIcon = CommonFilterButtonProps & {
  isChangeIcon?: undefined;
  iconChange?: any;
};

// Unión final de Botones de acciones generales
export type FilterButton = FilterButtonWithChangeIcon | FilterButtonWithoutChangeIcon;

// =====================================================

// Selects de filtros
export interface DropdownFilterSelect {
  type: 'dropdown';
  selected: any;
  initSelected?: any;
  onSelected?: (value: any) => void;
  optionLabel?: string;
  optionValue?: string;
  placeholder?: string;
  showClear?: boolean;
  options: any[];
  deep?: string;
}

export interface SearchableFilterSelect {
  type: 'searchable';
  selected: any;
  initSelected?: any;
  onSelected?: (value: any) => void;
  endpoint: string;
  isSearch?: boolean;
  optionLabel: string;
  optionValue: string;
  placeholder?: string;
  showClear?: boolean;
  loadOnInit?: boolean;
  searchFields?: string[];
  defaultFilters?: { [key: string]: any };
  deep?: string;
}

export interface MultiTableFilterSelect {
  type: 'multi-table';
  selected: any;
  initSelected?: any;
  onSelected?: (value: any) => void;
  columns: TableColumn<any>[];
  btnText?: string;
  placeholder?: string;
  deep?: string;
}

export type FilterSelect = DropdownFilterSelect | SearchableFilterSelect | MultiTableFilterSelect;

// =====================================================