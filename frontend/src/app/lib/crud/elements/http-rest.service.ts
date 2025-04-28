 
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


import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class HttpParamsService {

    constructor() { }

    // Formatear parámetros para peticiones HTTP
    resParams(params: Params): HttpParams {
        // Construir HttpParams
        let httpParams = new HttpParams();

        // Recorrer todos los parámetros
        if (params) {
            Object.keys(params).forEach(key => {
                const value = params[key];

                // Si el valor es un objeto (ej. filter: { id_status: [1, 2] })
                if (typeof value === 'object' && value !== null) {
                    Object.keys(value).forEach(subKey => {
                        const subValue = value[subKey];

                        // Si el subValor es un array (ej. id_status: [1, 2])
                        if (Array.isArray(subValue)) {
                            subValue.forEach(v => {
                                httpParams = httpParams.append(`${key}[${subKey}]`, v);
                            });
                        } else {
                            // Si es un valor único
                            httpParams = httpParams.append(`${key}[${subKey}]`, subValue);
                        }
                    });
                } else {
                    // Si es un valor plano (ej. id_status: 1)
                    httpParams = httpParams.append(key, value);
                }
            });
        }
        return httpParams;
    }

}
