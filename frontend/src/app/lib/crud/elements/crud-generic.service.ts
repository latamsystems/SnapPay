 
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
import { Params } from '@angular/router';
import { map, Observable } from 'rxjs';
import { HttpParamsService } from 'src/app/lib/crud/elements/http-rest.service';
import { ApiResponse } from 'src/app/core/interfaces/api-response';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ConverterService } from './converter.service';
import { QueryParams } from '../table-component/elements/table.interface';
import { SocketShared } from 'src/app/core/shared/socket.shared';

@Injectable({
    providedIn: 'root'
})
export class GenericService {

    constructor(
        private readonly http: HttpClient,
        private readonly HttpParamsService: HttpParamsService,
        private readonly converterService: ConverterService,
        private readonly socket: SocketShared,
    ) { }

    /**
     * Método genérico para obtener todos los registros desde un endpoint.
     * @param endpoint Distintivo del endpoint ('role', 'status', etc.)
     * @param params Parámetros de la petición.
     * @returns Observable con la respuesta de la API.
     */
    getAll<T>(endpoint: string, params?: Params): Observable<ApiResponse<T>> {
        const url = `${environment.urlBase}/${endpoint}`;

        // Construir HttpParams
        let httpParams;
        if (params) httpParams = this.HttpParamsService.resParams(params);

        // Hacer la petición GET con los HttpParams formateados
        return this.http.get<ApiResponse<T>>(url, { params: httpParams });
    }


    /**
     * Método genérico para obtener un registro desde un endpoint.
     * @param endpoint Distintivo del endpoint ('role', 'status', etc.)
     * @param id Identificador del registro.
     * @returns Observable con la respuesta de la API.
     */
    getId<T>(endpoint: string, id: number): Observable<T> {
        const url = `${environment.urlBase}/${endpoint}`;
        return this.http.get<ApiResponse<{ [key: string]: T }>>(`${url}/${id}`).pipe(
            map(response => response.data[endpoint])
        );
    }


    /**
     * Método genérico para agregar un registro a un endpoint.
     * @param endpoint Distintivo del endpoint ('role', 'status', etc.)
     * @param data Datos del registro a agregar.
     * @returns Observable con la respuesta de la API.
     */
    create<T>(endpoint: string, data: T): Observable<ApiResponse<T>> {
        const url = `${environment.urlBase}/${endpoint}`;
        return this.http.post<ApiResponse<T>>(url, data);
    }


    /**
     * Método genérico para actualizar un registro en un endpoint.
     * @param endpoint Distintivo del endpoint ('role', 'status', etc.)
     * @param id Identificador del registro.
     * @param data Datos del registro a actualizar.
     * @returns Observable con la respuesta de la API.
     */
    update<T>(endpoint: string, id: number, data: T): Observable<ApiResponse<T>> {
        const url = `${environment.urlBase}/${endpoint}`;
        return this.http.put<ApiResponse<T>>(`${url}/${id}`, data);
    }


    /**
     * Método genérico para eliminar un registro de un endpoint.
     * @param endpoint Distintivo del endpoint ('role', 'status', etc.)
     * @param id Identificador del registro.
     * @returns Observable con la respuesta de la API.
     */
    delete<T>(endpoint: string, id: number): Observable<ApiResponse<T>> {
        const url = `${environment.urlBase}/${endpoint}`;
        return this.http.delete<ApiResponse<T>>(`${url}/${id}`);
    }


    /**
    * Método genérico para actualizar estados de un registro en un endpoint.
    * @param endpoint Distintivo del endpoint ('role', 'status', etc.)
    * @param id Identificador del registro.
    * @param data Datos de un registro booleano a actualizar.
    * @returns Observable con la respuesta de la API.
    */
    enable<T>(endpoint: string, id: number, data: T): Observable<ApiResponse<T>> {
        const url = `${environment.urlBase}/${endpoint}`;
        return this.http.put<ApiResponse<T>>(`${url}/enable/${id}`, data);
    }


    /**
    * Método genérico para obtener los parámetros de consulta para una tabla.
    * @param page Número de página actual.
    * @param limit Número de registros por página.
    * @param sort Objeto que contiene la columna y la dirección de ordenamiento.
    * @param filters Filtros aplicados a la consulta.
    * @param defaultFilters Filtros predeterminados aplicados a la consulta.
    * @param searchQuery Cadena de búsqueda.
    * @param columns Columnas a buscar.
    * @returns 
    */
    params({page, limit, sort, filters, defaultFilters, searchQuery, columns}: QueryParams): Params {
        
        const params: Params = {}

        if (page) params['page'] = page.toString();
        if (limit) params['limit'] = limit.toString();

        // Aplicar los filtros predeterminados enviados desde el padre
        Object.keys(defaultFilters ?? {}).forEach((key) => {
            if (!filters.hasOwnProperty(key)) {
                params[`filter[${key}]`] = defaultFilters![key];
            }
        });

        // Aplicar el ordenamiento si se ha proporcionado
        if (sort?.column && sort?.direction !== 'none') {
            const sortKey = this.converterService.getSortKey(sort?.column);
            params['sortBy'] = sortKey;
            params['sortOrder'] = sort?.direction?.toUpperCase();
        }

        // Aplicar la búsqueda si se ha proporcionado
        if (searchQuery && searchQuery.trim() !== '') {
            params['search'] = searchQuery;
            params['searchFields'] = columns?.map(col => col) ;
        }

        // Aplicar los filtros si se han proporcionado
        if (Object.keys(filters).length > 0) {
            params['filter'] = filters;
        }

        return params;
    }

    // =====================
    // WebSocket Genéricos
    // =====================

    /**
     * Escuchar evento de creación
     * @param entity nombre de la entidad (ej: 'period', 'user')
     */
    onCreated<T = any>(entity: string): Observable<T> {
        return this.socket.listenTo<T>(`${entity}:created`);
    }
    
    /**
     * Escuchar evento de actualización
     */
    onUpdated<T = any>(entity: string): Observable<T> {
        return this.socket.listenTo<T>(`${entity}:updated`);
    }
    
    /**
     * Escuchar evento de eliminación
     */
    onDeleted<T = any>(entity: string): Observable<T> {
        return this.socket.listenTo<T>(`${entity}:deleted`);
    }
    
    /**
     * Escuchar evento de activación/habilitación
     */
    onEnabled<T = any>(entity: string): Observable<T> {
        return this.socket.listenTo<T>(`${entity}:enabled`);
    }

    /**
     * Escuchar múltiples eventos de una entidad
     * @param entity nombre de la entidad (ej: 'period')
     * @param actions lista de eventos a escuchar (ej: ['created', 'updated'])
     * @param persistent true si quieres que se mantenga el listener al salir del componente
     */
    listenToMany<T = any>(
        entity: string,
        actions: Array<'created' | 'updated' | 'deleted' | 'enabled' | string>,
        persistent: boolean = false
    ): Observable<{ event: string, data: T }> {
        return this.socket.listenToMany<T>(entity, actions, persistent);
    }
    
}


    /**
     * Ejemplo de uso de los métodos genéricos.
     */

    // const data: RoleResult = {
    //     id_role: 5,
    //     name_role: 'Prueba',
    //     creationDate_role: null,
    // }


    // === OBTENER TODOS LOS REGISTROS ===

    // this.genericService.getAll<RoleData>('role').subscribe({
    //   next: (response) => {
    //     console.log('Generico All', response.data.role);

    //   }
    // })


    // === OBTENER UN REGISTRO POR ID

    // this.genericService.getId<RoleResult>('role', 1).subscribe({
    //   next: (response) => {
    //     const data = response.id_role;
    //     console.log('Generico id', data);
    //   }
    // });

    // === AGREGAR UN REGISTRO ===

    // this.genericService.create<RoleResult>('role', data).subscribe({
    //   next: (response) => {
    //     const data = response.msg; 
    //     console.log('Generico create', data);
    //   }
    // });


    // === ACTUALIZAR UN REGISTRO ===

    // this.genericService.update<RoleResult>('role', data.id_role, data).subscribe({
    //   next: (response) => {
    //     const data = response.msg; 
    //     console.log('Generico update', data);
    //   }
    // });


    // === ELIMINAR UN REGISTRO ===

    // this.genericService.delete<RoleResult>('role', data.id_role).subscribe({
    //     next: (response) => {
    //         const data = response.msg; 
    //         console.log('Generico delete', data);
    //     }
    // });


    // === ACTUALIZAR ESTADO DE UN REGISTRO ===

    // this.genericService.enable<RoleResult>('role', data.id_role, data).subscribe({
    //     next: (response) => {
    //         const data = response.msg;
    //         console.log('Generico enable', data);
    //     }
    // });
