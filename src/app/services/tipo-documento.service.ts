import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces definidas en el mismo archivo (según tu estándar)
export interface TipoDocumento {
  IdTipoDocumento?: number;
  Nombre: string;
  FechaCreacion?: string;
  UsuarioCreacion?: string;
  FechaModificacion?: string;
  UsuarioModificacion?: string;
}

export interface TipoDocumentoResponse {
  Resultado: number;
  Mensaje: string;
  Data?: TipoDocumento;
  // Para búsquedas paginadas
  Pagina?: number;
  TamanoPagina?: number;
  Total?: number;
  Items?: TipoDocumento[];
}

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {
  // TODO: Ajusta esta URL según tu servidor
  private baseUrl = 'http://localhost:54409/TiposDocumento';

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
   * Listar un tipo de documento específico por ID o Nombre
   */
  listar(idTipoDocumento?: number, nombre?: string, incluirAuditoria: boolean = false): Observable<TipoDocumentoResponse> {
    let params = new HttpParams()
      .set('usuarioAccion', this.getUsuarioActual())
      .set('incluirAuditoria', incluirAuditoria.toString());

    if (idTipoDocumento) {
      params = params.set('IdTipoDocumento', idTipoDocumento.toString());
    }
    if (nombre) {
      params = params.set('Nombre', nombre);
    }

    return this.http.get<TipoDocumentoResponse>(`${this.baseUrl}/Listar`, { params });
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
  ): Observable<TipoDocumentoResponse> {
    let params = new HttpParams()
      .set('usuarioAccion', this.getUsuarioActual())
      .set('Pagina', pagina.toString())
      .set('TamanoPagina', tamanoPagina.toString())
      .set('OrdenPor', ordenPor)
      .set('OrdenDir', ordenDir);

    if (buscar) {
      params = params.set('Buscar', buscar);
    }

    return this.http.get<TipoDocumentoResponse>(`${this.baseUrl}/ListarBusqueda`, { params });
  }

  /**
   * Crear un nuevo tipo de documento
   */
  crear(nombre: string): Observable<TipoDocumentoResponse> {
    const params = new HttpParams()
      .set('Usuario', this.getUsuarioActual())
      .set('Nombre', nombre);

    return this.http.get<TipoDocumentoResponse>(`${this.baseUrl}/Crear`, { params });
  }

  /**
   * Actualizar un tipo de documento existente
   */
  actualizar(idTipoDocumento: number, nombre: string): Observable<TipoDocumentoResponse> {
    const params = new HttpParams()
      .set('Usuario', this.getUsuarioActual())
      .set('IdTipoDocumento', idTipoDocumento.toString())
      .set('Nombre', nombre);

    return this.http.get<TipoDocumentoResponse>(`${this.baseUrl}/Actualizar`, { params });
  }

  /**
   * Eliminar un tipo de documento
   */
  eliminar(idTipoDocumento: number): Observable<TipoDocumentoResponse> {
    const params = new HttpParams()
      .set('Usuario', this.getUsuarioActual())
      .set('IdTipoDocumento', idTipoDocumento.toString());

    return this.http.get<TipoDocumentoResponse>(`${this.baseUrl}/Eliminar`, { params });
  }

  /**
   * Listar sin parámetros (para uso en otros servicios)
   */
  listarSinParametros(): Observable<TipoDocumentoResponse> {
    return this.http.get<TipoDocumentoResponse>(`${this.baseUrl}/ListarBusqueda?usuarioAccion=${this.getUsuarioActual()}&Pagina=1&TamanoPagina=100`);
  }
}
