import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface EstadoCivilDto {
  IdEstadoCivil: number;
  Nombre: string;
  FechaCreacion?: string;
  UsuarioCreacion?: string;
  FechaModificacion?: string | null;
  UsuarioModificacion?: string | null;
}

export interface EstadoCivilListarRequest {
  IdEstadoCivil?: number;
  BuscarNombre?: string;
  Pagina?: number;
  TamanoPagina?: number;
}

export interface EstadosCivilesBackendResponse {
  ok?: boolean;
  data?: EstadoCivilDto[];
  error?: string;
  Mensaje?: string;
  Resultado?: number;
  Items?: EstadoCivilDto[];
  TotalItems?: number;
}

@Injectable({ providedIn: 'root' })
export class EstadoCivilService {
  private apiUrl = 'http://localhost:54409/EstadosCiviles';
  // private apiUrl = 'http://smart.guateplast.com.gt:58096/EstadosCiviles';

  constructor(private http: HttpClient) {}

  /** Devuelve un NOMBRE de usuario; si no hay, 'Administrador'/'system' */
  private getUsuarioActual(): string {
    try {
      const raw = localStorage.getItem('currentUser');
      if (!raw) return 'Administrador';
      const u = JSON.parse(raw);
      // intenta varios campos; ajusta a tu payload real
      return u?.Usuario || u?.UserName || u?.NombreUsuario || u?.Nombre || 'Administrador';
    } catch {
      return 'Administrador';
    }
  }

  /** Listado paginado -> /ListarBusqueda */
  listar(req: EstadoCivilListarRequest): Observable<EstadosCivilesBackendResponse> {
    let params = new HttpParams().set('usuarioAccion', this.getUsuarioActual());
    if (req.BuscarNombre) params = params.set('BuscarNombre', req.BuscarNombre);
    if (req.Pagina != null) params = params.set('Page', String(req.Pagina));
    if (req.TamanoPagina != null) params = params.set('PageSize', String(req.TamanoPagina));
    return this.http.get<EstadosCivilesBackendResponse>(`${this.apiUrl}/ListarBusqueda`, { params });
  }

  /** Obtener por ID -> /ListarPorId (ojo: antes estaba /Listar) */
  obtener(id: number): Observable<EstadosCivilesBackendResponse> {
  const params = new HttpParams()
    .set('IdEstadoCivil', String(id))
    .set('usuarioAccion', this.getUsuarioActual());
  return this.http.get<EstadosCivilesBackendResponse>(`${this.apiUrl}/ListarBusqueda`, { params });
}

  /** Crear -> /Crear */
  crear(nombre: string): Observable<{ ok: boolean; Mensaje?: string }> {
    const params = new HttpParams()
      .set('Nombre', nombre)
      .set('Usuario', this.getUsuarioActual());

    return this.http.get(`${this.apiUrl}/Crear`, {
      params,
      observe: 'response',
      responseType: 'json'
    }).pipe(map(this.parseApiResponse));
  }

  /** Actualizar -> /Actualizar */
  actualizar(id: number, nombre: string): Observable<{ ok: boolean; Mensaje?: string }> {
    const params = new HttpParams()
      .set('IdEstadoCivil', String(id))
      .set('Nombre', nombre)
      .set('Usuario', this.getUsuarioActual());

    return this.http.get(`${this.apiUrl}/Actualizar`, {
      params,
      observe: 'response',
      responseType: 'json'
    }).pipe(map(this.parseApiResponse));
  }

  /** Eliminar -> /Eliminar  (quita HardDelete) */
  eliminar(id: number): Observable<{ ok: boolean; Mensaje?: string }> {
    const params = new HttpParams()
      .set('IdEstadoCivil', String(id))
      .set('Usuario', this.getUsuarioActual());

    return this.http.get(`${this.apiUrl}/Eliminar`, {
      params,
      observe: 'response',
      responseType: 'json'
    }).pipe(map(this.parseApiResponse));
  }

  /** Normaliza respuestas JSON del backend a {ok, Mensaje} */
  private parseApiResponse = (resp: HttpResponse<any>) => {
    const b = resp.body ?? {};
    // backend de Postman: { Resultado:0/1, Mensaje:"..." }
    const ok = b?.Resultado === 1 || b?.ok === true || b?.Exito === true;
    const Mensaje = b?.Mensaje || b?.error || '';
    return { ok, Mensaje };
  };
}
