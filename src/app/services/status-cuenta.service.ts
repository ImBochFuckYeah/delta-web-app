import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces definidas en el mismo archivo (según tu estándar)
export interface StatusCuenta {
  IdStatusCuenta?: number;
  Nombre: string;
  FechaCreacion?: string;
  UsuarioCreacion?: string;
  FechaModificacion?: string;
  UsuarioModificacion?: string;
}

export interface StatusCuentaResponse {
  Resultado: number;
  Mensaje: string;
  Data?: StatusCuenta;
  // Para búsquedas paginadas
  Pagina?: number;
  TamanoPagina?: number;
  Total?: number;
  Items?: StatusCuenta[];
}

@Injectable({
  providedIn: 'root'
})
export class StatusCuentaService {
  // TODO: Ajusta esta URL según tu servidor
  private baseUrl = 'http://localhost:54409/StatusDeCuentas';

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
   * Listar un status de cuenta específico por ID o Nombre
   */
  listar(idStatusCuenta?: number, nombre?: string, incluirAuditoria: boolean = false): Observable<StatusCuentaResponse> {
    let params = new HttpParams()
      .set('usuarioAccion', this.getUsuarioActual())
      .set('incluirAuditoria', incluirAuditoria.toString());

    if (idStatusCuenta) {
      params = params.set('IdStatusCuenta', idStatusCuenta.toString());
    }
    if (nombre) {
      params = params.set('Nombre', nombre);
    }

    return this.http.get<StatusCuentaResponse>(`${this.baseUrl}/Listar`, { params });
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
  ): Observable<StatusCuentaResponse> {
    let params = new HttpParams()
      .set('usuarioAccion', this.getUsuarioActual())
      .set('Pagina', pagina.toString())
      .set('TamanoPagina', tamanoPagina.toString())
      .set('OrdenPor', ordenPor)
      .set('OrdenDir', ordenDir);

    if (buscar) {
      params = params.set('Buscar', buscar);
    }

    return this.http.get<StatusCuentaResponse>(`${this.baseUrl}/ListarBusqueda`, { params });
  }

  /**
   * Crear un nuevo status de cuenta
   */
  crear(nombre: string): Observable<StatusCuentaResponse> {
    const params = new HttpParams()
      .set('Usuario', this.getUsuarioActual())
      .set('Nombre', nombre);

    return this.http.get<StatusCuentaResponse>(`${this.baseUrl}/Crear`, { params });
  }

  /**
   * Actualizar un status de cuenta existente
   */
  actualizar(idStatusCuenta: number, nombre: string): Observable<StatusCuentaResponse> {
    const params = new HttpParams()
      .set('Usuario', this.getUsuarioActual())
      .set('IdStatusCuenta', idStatusCuenta.toString())
      .set('Nombre', nombre);

    return this.http.get<StatusCuentaResponse>(`${this.baseUrl}/Actualizar`, { params });
  }

  /**
   * Eliminar un status de cuenta
   */
  eliminar(idStatusCuenta: number): Observable<StatusCuentaResponse> {
    const params = new HttpParams()
      .set('Usuario', this.getUsuarioActual())
      .set('IdStatusCuenta', idStatusCuenta.toString());

    return this.http.get<StatusCuentaResponse>(`${this.baseUrl}/Eliminar`, { params });
  }

  /**
   * Listar sin parámetros (para uso en otros servicios)
   */
  listarSinParametros(): Observable<StatusCuentaResponse> {
    return this.http.get<StatusCuentaResponse>(`${this.baseUrl}/ListarBusqueda?usuarioAccion=${this.getUsuarioActual()}&Pagina=1&TamanoPagina=100`);
  }
}
