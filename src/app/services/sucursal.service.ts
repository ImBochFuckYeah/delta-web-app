import { Injectable, Signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SucursalRequest {
  Usuario: string,
  IdSucursal?: number,
  IdEmpresa?: number,
  BuscarNombre?: string,
  Page?: number,
  PageSize?: number,
  Nombre?: string,
  Direccion?: string,
}

export interface SucursalResponse {
  ok: boolean,
  error?: string,
  meesage?: string,
  id?: number,
  data?: SucursalRequest[];
}

@Injectable({
  providedIn: 'root'
})
export class SucursalService {
  //private baseUrl = 'http://smart.guateplast.com.gt:58096/Sucursales';
  private baseUrl = 'http://localhost:54409/Sucursales';

  constructor(private http: HttpClient) { }

  private getUsuarioActual(): string {
    const sessionStr = localStorage.getItem('currentUser');
    if (sessionStr) {
      try {
        const sessionObj = JSON.parse(sessionStr);
        return sessionObj.IdUsuario || 'Desconocido';
      } catch {
        return 'Desconocido';
      }
    }
    return 'Desconocido';
  }

  listar(request: SucursalRequest): Observable<SucursalResponse> {
    let params = new HttpParams()
      .set('Page', request.Page!.toString())
      .set('PageSize', request.PageSize!.toString())
      .set('Usuario', this.getUsuarioActual());
    if (request.IdSucursal) params = params.set('IdSucursal', request.IdSucursal.toString());
    if (request.BuscarNombre) params = params.set('BuscarNombre', request.BuscarNombre.toString());

    return this.http.get<SucursalResponse>(`${this.baseUrl}/Listar`, { params });
  }

  crear(request: SucursalRequest): Observable<SucursalResponse> {
    let params = new HttpParams()
      .set('Nombre', request.Nombre!.toString())
      .set('IdEmpresa', request.IdEmpresa!.toString())
      .set('Direccion', request.Direccion!.toString())
      .set('Usuario', this.getUsuarioActual());
    return this.http.get<SucursalResponse>(`${this.baseUrl}/Crear`, { params });
  }

  editar(request: SucursalRequest): Observable<SucursalResponse> {
    let params = new HttpParams()
      .set('IdSucursal', request.IdSucursal!.toString())
      .set('IdEmpresa', request.IdEmpresa!.toString())
      .set('Nombre', request.Nombre!.toString())
      .set('Direccion', request.Direccion!.toString())
      .set('Usuario', this.getUsuarioActual());
    return this.http.get<SucursalResponse>(`${this.baseUrl}/Actualizar`, { params });
  }

  eliminar(request: SucursalRequest): Observable<SucursalResponse> {
    let params = new HttpParams()
      .set('IdSucursal', request.IdSucursal!.toString())
      .set('Usuario', this.getUsuarioActual());
    return this.http.get<SucursalResponse>(`${this.baseUrl}/Eliminar`, { params });
  }

  // usado en servicios externos
  obtenerSucursales(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Listar?Page=1&PageSize=100`);
  }
}
