import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface MenuRequest {
  IdMenu?: number;
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

export interface MenuObj {
  IdMenu?: number;
  IdModulo?: number;
  Nombre?: string;
  OrdenMenu?: number;
  ModuloNombre?: string;
  FechaCreacion?: string;
  FechaModificacion?: string;
  UsuarioCreacion?: string;
  UsuarioModificacion?: string;
}

export interface ApiResponse<T> {
  ok?: boolean;
  data?: T;
  Data?: T;
  error?: string;
  message?: string;
  Items?: T;
  Pagina?: number;
  Resultado?: number;
  TamanoPagina?: number;
  Total?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private baseUrl = 'http://localhost:54409/Menus';

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

  listar(request: MenuRequest): Observable<ApiResponse<MenuObj[]>> {
    let params = new HttpParams()
      .set('usuarioAccion', request.usuarioAccion || this.getUsuarioActual())
      .set('incluirAuditoria', request.incluirAuditoria || false);
    
    if (request.IdMenu) params = params.set('IdMenu', request.IdMenu.toString());
    if (request.IdModulo) params = params.set('IdModulo', request.IdModulo.toString());
    if (request.Nombre) params = params.set('Nombre', request.Nombre.toString());

    return this.http.get<ApiResponse<MenuObj[]>>(`${this.baseUrl}/Listar`, { params });
  }

  listarBusqueda(request: MenuRequest): Observable<ApiResponse<MenuObj[]>> {
    let params = new HttpParams()
      .set('usuarioAccion', request.usuarioAccion || this.getUsuarioActual())
      .set('Pagina', request.Pagina?.toString() || '1')
      .set('TamanoPagina', request.TamanoPagina?.toString() || '20')
      .set('OrdenPor', request.OrdenPor || 'Nombre')
      .set('OrdenDir', request.OrdenDir || 'ASC');
    
    if (request.Buscar) params = params.set('Buscar', request.Buscar);
    if (request.IdModulo) params = params.set('IdModulo', request.IdModulo.toString());

    return this.http.get<ApiResponse<MenuObj[]>>(`${this.baseUrl}/ListarBusqueda`, { params });
  }

  crear(request: MenuRequest): Observable<ApiResponse<MenuObj>> {
    let params = new HttpParams()
      .set('Usuario', request.Usuario || this.getUsuarioActual());
    
    if (request.IdModulo) params = params.set('IdModulo', request.IdModulo.toString());
    if (request.Nombre) params = params.set('Nombre', request.Nombre);
    if (request.OrdenMenu) params = params.set('OrdenMenu', request.OrdenMenu.toString());

    return this.http.get<ApiResponse<MenuObj>>(`${this.baseUrl}/Crear`, { params });
  }

  actualizar(request: MenuRequest): Observable<ApiResponse<MenuObj>> {
    let params = new HttpParams()
      .set('Usuario', request.Usuario || this.getUsuarioActual());
    
    if (request.IdMenu) params = params.set('IdMenu', request.IdMenu.toString());
    if (request.IdModulo) params = params.set('IdModulo', request.IdModulo.toString());
    if (request.Nombre) params = params.set('Nombre', request.Nombre);
    if (request.OrdenMenu) params = params.set('OrdenMenu', request.OrdenMenu.toString());

    return this.http.get<ApiResponse<MenuObj>>(`${this.baseUrl}/Actualizar`, { params });
  }

  eliminar(request: MenuRequest): Observable<ApiResponse<any>> {
    let params = new HttpParams()
      .set('Usuario', request.Usuario || this.getUsuarioActual());
    
    if (request.IdMenu) params = params.set('IdMenu', request.IdMenu.toString());

    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/Eliminar`, { params });
  }
}
