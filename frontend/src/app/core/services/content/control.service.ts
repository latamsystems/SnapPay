import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { ApiResponse } from 'src/app/core/interfaces/api-response';

@Injectable({
  providedIn: 'root'
})
export class ControlService {

  // Endpoint Servidor
  private readonly url: string = `${environment.urlBase}${environment.urlControl}`;

  constructor(
    private readonly http: HttpClient,
  ) { }

  // Rsumen general
  getGeneralResume(userId: number | null) {
    return this.http.get<ApiResponse<{ control: any }>>(`${this.url}/resume/${userId}`);
  }

}
