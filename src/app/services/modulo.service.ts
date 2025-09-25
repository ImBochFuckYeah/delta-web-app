import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ModuloRequest {
  IdModulo?: number;
  Nombre?: string;
  OrdenMenu?: number;
  usuarioAccion?: string;
  Usuario?: string;
  incluirAuditoria?: boolean;
  Buscar?: string;
  Pagina?: number;
  TamanoPagina?: number;
  OrdenPor?: string;
  OrdenDir?: string;
}

export interface ModuloResponse {
  Resultado?: number;
  Mensaje?: string;
  Data?: ModuloRequest[];
  Pagina?: number;
  TamanoPagina?: number;
  Total?: number;
  Items?: ModuloRequest[];
}

@Injectable({
  providedIn: 'root'
})
export class ModuloService {
  private baseUrl = 'http://localhost:54409/Modulos';

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

  listar(request: ModuloRequest): Observable<ModuloResponse> {
    let params = new HttpParams()
      .set('UsuarioAccion', this.getUsuarioActual())
      .set('IncluirAuditoria', true);
      // .set('Nombre', request.Nombre!.toString());
    if (request.Nombre) params = params.set('Nombre', request.Nombre.toString());
    if (request.IdModulo) params = params.set('IdModulo', request.IdModulo.toString());
    return this.http.get<ModuloResponse>(`${this.baseUrl}/Listar`, { params });
  }

  crear(request: ModuloRequest): Observable<ModuloResponse> {
    let params = new HttpParams()
      .set('Usuario', this.getUsuarioActual());
    if (request.Nombre) params = params.set('Nombre', request.Nombre.toString());
    if (request.OrdenMenu) params = params.set('OrdenMenu', request.OrdenMenu.toString());
    return this.http.get<ModuloResponse>(`${this.baseUrl}/Crear`, { params });
  }

  editar(request: ModuloRequest): Observable<ModuloResponse> {
    let params = new HttpParams()
      .set('Usuario', this.getUsuarioActual());
    if (request.IdModulo) params = params.set('IdModulo', request.IdModulo.toString());
    if (request.Nombre) params = params.set('Nombre', request.Nombre.toString());
    if (request.OrdenMenu) params = params.set('OrdenMenu', request.OrdenMenu.toString());
    return this.http.put<ModuloResponse>(`${this.baseUrl}/Actualizar`, { params });
  }

  eliminar(request: ModuloRequest): Observable<ModuloResponse> {
    let params = new HttpParams()
      .set('Usuario', this.getUsuarioActual());
    if (request.IdModulo) params = params.set('IdModulo', request.IdModulo.toString());
    return this.http.delete<ModuloResponse>(`${this.baseUrl}/Eliminar`, { params });
  }
}
