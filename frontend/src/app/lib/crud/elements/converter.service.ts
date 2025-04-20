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