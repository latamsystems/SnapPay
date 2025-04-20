import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { LoginUserResoult } from 'src/app/core/interfaces/auth';
import { ApiResponse } from 'src/app/core/interfaces/api-response';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  // Endpoint Servidor
  url: string = `${environment.urlBase}${environment.urlMail}`;

  constructor(
    private http: HttpClient,
  ) { }

  // Codigo pestablecer contraseña
  resetPasswordCode(formData: LoginUserResoult): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.url}/resetPassword`, formData);
  }

  // Enviar pago pendiente
  payment(formData: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.url}/payment`, formData);
  }

  // Enviar pagos pendientes
  payments(paymentDetails: any, formData: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.url}/payments`, { formData, paymentDetails });
  }
}
