import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface TipoMovDto {
  IdTipoMovimientoCXC: number;
  Nombre: string;
  OperacionCuentaCorriente: 'Cargo' | 'Abono';
  FechaCreacion?: string;
  UsuarioCreacion?: string;
}

export interface ListRequest {
  BuscarNombre?: string;
  Pagina?: number;
  TamanoPagina?: number;
}

export interface BackendResponse<T = any> {
  ok?: boolean;
  Exito?: boolean;
  error?: string;
  Mensaje?: string;      // 'OK'
  Resultado?: number;    // 1 en éxito
  Items: T[];
  TotalItems?: number;
}

@Injectable({ providedIn: 'root' })
export class TiposMovimientoCxcService {
  private apiUrl = 'http://localhost:54409/TiposMovimientoCXC';
  // private apiUrl = 'http://smart.guateplast.com.gt:58096/TiposMovimientoCXC';

  constructor(private http: HttpClient) {}

  private getUsuarioActual(): string {
    const s = localStorage.getItem('currentUser');
    if (s) { try { return JSON.parse(s)?.IdUsuario || 'system'; } catch { return 'system'; } }
    return 'system';
  }

  /** Normaliza la operación a 'Cargo' | 'Abono' */
  private toOperacion(valor: string | number): 'Cargo' | 'Abono' {
    const v = String(valor).toLowerCase();
    if (v === '1' || v === 'cargo') return 'Cargo';
    return 'Abono';
  }

  listar(req: ListRequest): Observable<BackendResponse<TipoMovDto>> {
    let params = new HttpParams().set('usuarioAccion', this.getUsuarioActual());
    if (req.BuscarNombre?.trim()) params = params.set('BuscarNombre', req.BuscarNombre.trim());
    if (req.Pagina != null) params = params.set('Page', String(req.Pagina));
    if (req.TamanoPagina != null) params = params.set('PageSize', String(req.TamanoPagina));
    return this.http.get<BackendResponse<TipoMovDto>>(`${this.apiUrl}/ListarBusqueda`, { params });
  }

  obtener(id: number): Observable<BackendResponse<TipoMovDto>> {
    const params = new HttpParams()
      .set('IdTipoMovimientoCXC', String(id))
      .set('usuarioAccion', this.getUsuarioActual());
    return this.http.get<BackendResponse<TipoMovDto>>(`${this.apiUrl}/ListarBusqueda`, { params });
  }

  crear(nombre: string, operacionCuentaCorriente: number) {
  const usuario = this.getUsuarioActual();
  const params = new HttpParams()
    .set('Usuario', usuario)
    .set('Nombre', nombre)
    .set('OperacionCuentaCorriente', String(operacionCuentaCorriente));
  return this.http.get(`${this.apiUrl}/Crear`, { params });
}

actualizar(id: number, nombre: string, operacionCuentaCorriente: number) {
  const usuario = this.getUsuarioActual();
  const params = new HttpParams()
    .set('IdTipoMovimientoCXC', String(id))
    .set('Usuario', usuario)
    .set('Nombre', nombre)
    .set('OperacionCuentaCorriente', String(operacionCuentaCorriente));

  return this.http.get(`${this.apiUrl}/Actualizar`, { params }); // 👈 usa el nombre exacto de tu API
}
  eliminar(id: number): Observable<any> {
    const params = new HttpParams()
      .set('IdTipoMovimientoCXC', String(id))
      .set('Usuario', this.getUsuarioActual())
      .set('HardDelete', 'true');

    return this.http.get(`${this.apiUrl}/Eliminar`, { params, observe: 'response', responseType: 'json' })
      .pipe(map(r => (r as any).body ?? r));
  }
}
