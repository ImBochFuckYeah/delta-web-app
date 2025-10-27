import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces definidas en el mismo archivo (según tu estándar)
export interface TipoSaldoCuenta {
  IdTipoSaldoCuenta?: number;
  Nombre: string;
  FechaCreacion?: string;
  UsuarioCreacion?: string;
  FechaModificacion?: string;
  UsuarioModificacion?: string;
}

export interface TipoSaldoCuentaResponse {
  Resultado: number;
  Mensaje: string;
  Data?: TipoSaldoCuenta;
  // Para búsquedas paginadas
  Pagina?: number;
  TamanoPagina?: number;
  Total?: number;
  Items?: TipoSaldoCuenta[];
}

@Injectable({
  providedIn: 'root'
})
export class TipoSaldoCuentaService {
  // TODO: Ajusta esta URL según tu servidor
  private baseUrl = 'http://localhost:54409/TiposSaldoCuenta';

  constructor(private http: HttpClient) { }

  /**
   * Obtener el usuario actual desde localStorage
   */
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

  /**
   * Listar un tipo de cuenta específico por ID o Nombre
   */
  listar(idTipoSaldoCuenta?: number, nombre?: string, incluirAuditoria: boolean = false): Observable<TipoSaldoCuentaResponse> {
    let params = new HttpParams()
      .set('usuarioAccion', this.getUsuarioActual())
      .set('incluirAuditoria', incluirAuditoria.toString());

    if (idTipoSaldoCuenta) {
      params = params.set('IdTipoSaldoCuenta', idTipoSaldoCuenta.toString());
    }
    if (nombre) {
      params = params.set('Nombre', nombre);
    }

    return this.http.get<TipoSaldoCuentaResponse>(`${this.baseUrl}/Listar`, { params });
  }

  /**
   * Listar con búsqueda y paginación
   */
  listarBusqueda(
    buscar: string = '',
    pagina: number = 1,
    tamanoPagina: number = 50,
    ordenPor: string = 'Nombre',
    ordenDir: string = 'ASC'
  ): Observable<TipoSaldoCuentaResponse> {
    let params = new HttpParams()
      .set('usuarioAccion', this.getUsuarioActual())
      .set('Pagina', pagina.toString())
      .set('TamanoPagina', tamanoPagina.toString())
      .set('OrdenPor', ordenPor)
      .set('OrdenDir', ordenDir);

    if (buscar) {
      params = params.set('Buscar', buscar);
    }

    return this.http.get<TipoSaldoCuentaResponse>(`${this.baseUrl}/ListarBusqueda`, { params });
  }

  /**
   * Crear un nuevo tipo de cuenta
   */
  crear(nombre: string): Observable<TipoSaldoCuentaResponse> {
    const params = new HttpParams()
      .set('Usuario', this.getUsuarioActual())
      .set('Nombre', nombre);

    return this.http.get<TipoSaldoCuentaResponse>(`${this.baseUrl}/Crear`, { params });
  }

  /**
   * Actualizar un tipo de cuenta existente
   */
  actualizar(idTipoSaldoCuenta: number, nombre: string): Observable<TipoSaldoCuentaResponse> {
    const params = new HttpParams()
      .set('Usuario', this.getUsuarioActual())
      .set('IdTipoSaldoCuenta', idTipoSaldoCuenta.toString())
      .set('Nombre', nombre);

    return this.http.get<TipoSaldoCuentaResponse>(`${this.baseUrl}/Actualizar`, { params });
  }

  /**
   * Eliminar un tipo de cuenta
   */
  eliminar(idTipoSaldoCuenta: number): Observable<TipoSaldoCuentaResponse> {
    const params = new HttpParams()
      .set('Usuario', this.getUsuarioActual())
      .set('IdTipoSaldoCuenta', idTipoSaldoCuenta.toString());

    return this.http.get<TipoSaldoCuentaResponse>(`${this.baseUrl}/Eliminar`, { params });
  }

  /**
   * Listar sin parámetros (para uso en otros servicios)
   */
  listarSinParametros(): Observable<TipoSaldoCuentaResponse> {
    return this.http.get<TipoSaldoCuentaResponse>(`${this.baseUrl}/ListarBusqueda?usuarioAccion=${this.getUsuarioActual()}&Pagina=1&TamanoPagina=100`);
  }
}
