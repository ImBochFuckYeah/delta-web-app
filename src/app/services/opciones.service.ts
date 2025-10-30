import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface OpcionesRequest {
  IdOpcion?: number;
  IdMenu?: number;
  Nombre?: string;
  Pagina?: string | number;  // Puede ser string para el endpoint de página web o number para paginación
  OrdenMenu?: number;
  usuarioAccion?: string;
  Usuario?: string;
  incluirAuditoria?: boolean;
  Buscar?: string;
  TamanoPagina?: number;
  OrdenPor?: string;
  OrdenDir?: string;
}

export interface OpcionesObj {
  IdOpcion?: number;
  IdMenu?: number;
  Nombre?: string;
  Pagina?: string;
  OrdenMenu?: number;
  MenuNombre?: string;
  FechaCreacion?: string;
  FechaModificacion?: string;
  UsuarioCreacion?: string;
  UsuarioModificacion?: string;
}

export interface ApiResponse<T> {
  ok?: boolean;
  data?: T;
  error?: string;
  message?: string;
  Items?: T;
  Data?: T;
  Resultado?: number;
  Mensaje?: string;
  Total?: number;
}

@Injectable({
  providedIn: 'root'
})
export class OpcionesService {
  private baseUrl = 'http://localhost:54409/Opciones';

  constructor(private http: HttpClient) { }

  private getUsuarioActual(): string {
    const sessionStr = localStorage.getItem('currentUser');
    if (sessionStr) {
      try {
        const sessionObj = JSON.parse(sessionStr);
        return sessionObj.IdUsuario || 'Administrador';
      } catch {
        return 'Administrador';
      }
    }
    return 'Administrador';
  }

  listar(request: OpcionesRequest): Observable<ApiResponse<OpcionesObj[]>> {
    let params = new HttpParams()
      .set('usuarioAccion', request.usuarioAccion || this.getUsuarioActual())
      .set('incluirAuditoria', request.incluirAuditoria?.toString() || 'false');
    
    if (request.IdOpcion) params = params.set('IdOpcion', request.IdOpcion.toString());
    if (request.IdMenu) params = params.set('IdMenu', request.IdMenu.toString());
    if (request.Nombre) params = params.set('Nombre', request.Nombre);
    if (request.Pagina) params = params.set('Pagina', request.Pagina);

    return this.http.get<ApiResponse<OpcionesObj[]>>(`${this.baseUrl}/Listar`, { params });
  }

  listarBusqueda(request: OpcionesRequest): Observable<ApiResponse<OpcionesObj[]>> {
    let params = new HttpParams()
      .set('usuarioAccion', request.usuarioAccion || this.getUsuarioActual())
      .set('Pagina', request.Pagina?.toString() || '1')
      .set('TamanoPagina', request.TamanoPagina?.toString() || '20')
      .set('OrdenPor', request.OrdenPor || 'Nombre')
      .set('OrdenDir', request.OrdenDir || 'ASC');
    
    if (request.Buscar) params = params.set('Buscar', request.Buscar);
    if (request.IdMenu) params = params.set('IdMenu', request.IdMenu.toString());

    return this.http.get<ApiResponse<OpcionesObj[]>>(`${this.baseUrl}/ListarBusqueda`, { params });
  }

  crear(request: OpcionesRequest): Observable<ApiResponse<OpcionesObj>> {
    let params = new HttpParams()
      .set('Usuario', request.Usuario || this.getUsuarioActual());
    
    if (request.IdMenu) params = params.set('IdMenu', request.IdMenu.toString());
    if (request.Nombre) params = params.set('Nombre', request.Nombre);
    if (request.Pagina) params = params.set('Pagina', request.Pagina);
    if (request.OrdenMenu) params = params.set('OrdenMenu', request.OrdenMenu.toString());

    return this.http.get<ApiResponse<OpcionesObj>>(`${this.baseUrl}/Crear`, { params });
  }

  actualizar(request: OpcionesRequest): Observable<ApiResponse<OpcionesObj>> {
    let params = new HttpParams()
      .set('Usuario', request.Usuario || this.getUsuarioActual());
    
    if (request.IdOpcion) params = params.set('IdOpcion', request.IdOpcion.toString());
    if (request.IdMenu) params = params.set('IdMenu', request.IdMenu.toString());
    if (request.Nombre) params = params.set('Nombre', request.Nombre);
    if (request.Pagina) params = params.set('Pagina', request.Pagina);
    if (request.OrdenMenu) params = params.set('OrdenMenu', request.OrdenMenu.toString());

    return this.http.get<ApiResponse<OpcionesObj>>(`${this.baseUrl}/Actualizar`, { params });
  }

  eliminar(request: OpcionesRequest): Observable<ApiResponse<any>> {
    let params = new HttpParams()
      .set('Usuario', request.Usuario || this.getUsuarioActual());
    
    if (request.IdOpcion) params = params.set('IdOpcion', request.IdOpcion.toString());

    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/Eliminar`, { params });
  }
}