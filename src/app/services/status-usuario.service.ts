import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StatusUsuarioDto {
  IdStatusUsuario: number;
  Nombre: string;
  FechaCreacion: string;
  UsuarioCreacion: string;
  FechaModificacion: string | null;
  UsuarioModificacion: string | null;
}

export interface StatusUsuarioListarRequest {
  IdStatusUsuario?: number;
  BuscarNombre?: string;
  Pagina?: number;
  TamanoPagina?: number;
}

export interface StatusUsuariosBackendResponse {
  ok: boolean;
  data: StatusUsuarioDto[];
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StatusUsuariosService {
  private apiUrl = 'http://localhost:54409/StatusUsuarios';
  //private apiUrl = 'http://smart.guateplast.com.gt:58096/StatusUsuarios';

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

  listar(request: StatusUsuarioListarRequest): Observable<StatusUsuariosBackendResponse> {
    let params = new HttpParams();

    if (request.IdStatusUsuario) params = params.set('IdStatusUsuario', request.IdStatusUsuario.toString());
    if (request.BuscarNombre) params = params.set('BuscarNombre', request.BuscarNombre);
    if (request.Pagina) params = params.set('Page', request.Pagina.toString());
    if (request.TamanoPagina) params = params.set('PageSize', request.TamanoPagina.toString());

    return this.http.get<StatusUsuariosBackendResponse>(`${this.apiUrl}/Listar`, { params });
  }

  obtener(id: number): Observable<StatusUsuariosBackendResponse> {
    return this.http.get<StatusUsuariosBackendResponse>(`${this.apiUrl}/Listar`, {
      params: { IdStatusUsuario: id.toString() }
    });
  }

  crear(nombre: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Crear`, {
      params: { Nombre: nombre, Usuario: this.getUsuarioActual() }
    });
  }

  actualizar(id: number, nombre: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Actualizar`, {
      params: { IdStatusUsuario: id.toString(), Nombre: nombre, Usuario: this.getUsuarioActual() }
    });
  }

  eliminar(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/Eliminar`, {
      params: { IdStatusUsuario: id.toString() }
    });
  }
}
