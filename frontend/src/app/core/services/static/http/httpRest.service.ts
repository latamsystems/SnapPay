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
