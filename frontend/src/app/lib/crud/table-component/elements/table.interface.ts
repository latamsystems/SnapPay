
 
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


// Tipado para las keys de la tabla
type KeyPath<T> = T extends object
    ? {
        [K in keyof T]: K extends string | number
        ? `${K}` | `${K}.${KeyPath<T[K]>}`
        : never;
    }[keyof T]
    : never;

type ExtraColumnKeys = 'total' | 'expand' | 'extra'; 
type ExtendedKeyPath<T> = KeyPath<T> | ExtraColumnKeys;

// Tipado para las columnas de la tabla
export interface TableColumn<T> {
    key: ExtendedKeyPath<T>; // Clave de la columna
    label: string; // Etiqueta de la columna
    visible?: boolean; // Indica si la columna es visible
    sortable?: boolean; // Indica si la columna es ordenable
    isSearchable?: boolean; // Indica si la columna es buscable
    isDisaled?: boolean; // Indica si la columna esta deshabilitada
    isDecorator?: boolean; // Indica si el valor esta decorado
    isCurrency?: boolean; // Indica si el valor es una moneda
    isdollar?: boolean; // Indica si el valor es en dolares
    isDate?: boolean; // Indica si el valor es una fecha
    isDateText?: boolean; // Indica si el valor es una fecha en texto
    isDateTime?: boolean; // Indica si el valor es una fecha y hora
    isRelativeTime?: boolean; // Indica si el valor es un tiempo relativo
    isDateTimeText?: boolean; // Indica si el valor es una fecha y hora en texto
    isFirstWord?: boolean; // Indica si el valor es la primera palabra
    styles?: { [key: string]: string }; // Estilos de la columna
    valueGetter?: (row: T) => any;  // Función para obtener el valor de la columna
    expandTemplate?: (row: T) => string;    // Plantilla para expandir la fila
    extraSearchFields?: (keyof T | string)[];   // Campos de búsqueda adicionales
    hidden?: boolean; // Indica si la columna está oculta
}

// Tipado para la dirección de ordenamiento
export type SortDirection = 'none' | 'asc' | 'desc';

// Estados de carga
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingStates {
    initialLoad: LoadingState;
    search: LoadingState;
    itemsPerPage: LoadingState;
    pagination: LoadingState;
    sort: LoadingState;
    checked: LoadingState;
    action: LoadingState;
    aditionalButtons: { [buttonType: string]: LoadingState };
}

// ======================================================

// Opciones de tabla

type DefaultTypeOptionTable = 'edit' | 'delete' | 'disabled' | 'custom';

type CommonOptionTableProps = {
    type?: `${DefaultTypeOptionTable}` | (string & {});
    icon?: ((data?: any) => any) | any;
    clicked?: (data: any) => void;
    tooltip?: ((data?: any) => string) | string;
    disabled?: ((data?: any) => boolean) | boolean;
    isVisible?: ((data?: any) => boolean) | boolean;
    tooltipPosition?: 'top' | 'right' | 'bottom' | 'left';
    ngClass?: ((data?: any) => any) | any;
    classes?: string;
};

// Caso 1: Si `isChangeIcon` está definido, `iconChange` es requerido
type OptionTableWithChangeIcon = CommonOptionTableProps & {
    isChangeIcon: boolean | (() => boolean);
    iconChange: any;
};

// Caso 2: Si `isChangeIcon` no está definido, `iconChange` es opcional
type OptionTableWithoutChangeIcon = CommonOptionTableProps & {
    isChangeIcon?: undefined;
    iconChange?: any;
};

// Unión final de Botones de acciones generales
export type OptionsTable = OptionTableWithChangeIcon | OptionTableWithoutChangeIcon;


// ===================================================

// Tipado para los parámetros de consulta
export interface QueryParams {
    page?: number;
    limit?: number;

    sort?: { column?: string | null; direction?: string };

    filters?: any;
    defaultFilters?: { [key: string]: any };

    searchQuery?: string;
    columns?: string[]
}