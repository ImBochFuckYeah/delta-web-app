import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {
  private apiUrl = 'http://smart.guateplast.com.gt:58096/Sucursales';

  constructor(private http: HttpClient) { }

  obtenerSucursales(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Listar?Page=1&PageSize=100`);
  }
}
