 
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


import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class ConverterService {

    constructor() { }

    /**
     * Obtener la clave de ordenación correcta
     * @param sortColumn 
     * @returns 
     */
    getSortKey(sortColumn: any): string {
        // Verifica si sortColumn es un objeto y retorna la propiedad 'col'
        if (typeof sortColumn === 'object' && sortColumn !== null) {
            return sortColumn.col;
        }
        // Si no es un objeto, asume que es una cadena directa
        return sortColumn;
    }


    /**
     * Convierte un objeto a un array de objetos con clave y valor para iniciar el formulario
     * @param formGroup 
     * @returns 
     */
    initializeFormControls(formGroup: FormGroup): { [key: string]: AbstractControl | null } {
        const formControls: { [key: string]: AbstractControl | null } = {};
    
        Object.keys(formGroup.controls).forEach(key => {
          formControls[`${key}_control`] = formGroup.get(key);
        });
    
        return formControls;
      }
}