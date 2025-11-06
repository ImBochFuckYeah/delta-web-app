import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

// Interfaces para el servicio
export interface EstadoCuentaHeader {
  IdSaldoCuenta: number;
  IdPersona: number;
  Nombre: string;
  Apellido: string;
  CorreoElectronico: string;
  Telefono: string;
  TipoCuenta: string;
  StatusCuenta: string;
  PeriodoDesde: string;
  PeriodoHasta: string;
  SaldoAnterior: number;
  SaldoInicialPeriodo: number;
}

export interface EstadoCuentaItem {
  IdMovimientoCuenta: number;
  FechaMovimiento: string;
  TipoMovimiento: string;
  DocumentoRef: string;
  Cargo: number;
  Abono: number;
  SaldoAcumulado: number;
}

export interface EstadoCuentaTotales {
  TotalCargos: number;
  TotalAbonos: number;
  SaldoInicial: number;
  SaldoFinal: number;
}

export interface EstadoCuentaResponse {
  Resultado: number;
  Mensaje: string;
  Header?: EstadoCuentaHeader;
  Items?: EstadoCuentaItem[];
  Totales?: EstadoCuentaTotales;
}

export interface ConsultarEstadoCuentaRequest {
  usuarioAccion: string;
  IdSaldoCuenta?: number;
  IdPersona?: number;
  Nombre?: string;
  Apellido?: string;
  Desde?: string; // formato: 'yyyy-MM-dd'
  Hasta?: string; // formato: 'yyyy-MM-dd'
  Pagina?: number;
  TamanoPagina?: number;
  OrdenDir?: 'ASC' | 'DESC';
}

// Interface para mantener el estado de la consulta
export interface EstadoConsulta {
  filtros: {
    IdSaldoCuenta: number | undefined;  // Cambio: sin '?'
    IdPersona: number | undefined;      // Cambio: sin '?'
    Nombre: string;
    Apellido: string;
    Desde: string;
    Hasta: string;
  };
  header: EstadoCuentaHeader | null;
  items: EstadoCuentaItem[];
  totales: EstadoCuentaTotales | null;
  mostrarResultados: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class EstadoCuentaService {
  // OPCIÓN 1: Con proxy (recomendado para desarrollo)
  // private apiUrl = '/EstadoCuenta';

  // OPCIÓN 2: URL directa (cambiar puerto según tu backend)
  private apiUrl = 'http://localhost:54409/EstadoCuenta';

  // BehaviorSubject para mantener el estado de la consulta
  private estadoConsultaSubject = new BehaviorSubject<EstadoConsulta | null>(null);
  public estadoConsulta$ = this.estadoConsultaSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Obtiene el usuario actual desde localStorage
   */
  private obtenerUsuarioActual(): string {
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
   * Consulta el estado de cuenta con filtros
   */
  consultar(request: ConsultarEstadoCuentaRequest): Observable<EstadoCuentaResponse> {
    let params = new HttpParams().set(
      'usuarioAccion',
      request.usuarioAccion || this.obtenerUsuarioActual()
    );

    if (request.IdSaldoCuenta) {
      params = params.set('IdSaldoCuenta', request.IdSaldoCuenta.toString());
    }
    if (request.IdPersona) {
      params = params.set('IdPersona', request.IdPersona.toString());
    }
    if (request.Nombre) {
      params = params.set('Nombre', request.Nombre);
    }
    if (request.Apellido) {
      params = params.set('Apellido', request.Apellido);
    }
    if (request.Desde) {
      params = params.set('Desde', request.Desde);
    }
    if (request.Hasta) {
      params = params.set('Hasta', request.Hasta);
    }
    if (request.Pagina) {
      params = params.set('Pagina', request.Pagina.toString());
    }
    if (request.TamanoPagina) {
      params = params.set('TamanoPagina', request.TamanoPagina.toString());
    }
    if (request.OrdenDir) {
      params = params.set('OrdenDir', request.OrdenDir);
    }

    return this.http.get<EstadoCuentaResponse>(`${this.apiUrl}/Consultar`, { params });
  }

  /**
   * Exporta el estado de cuenta a CSV
   */
  exportarCsv(request: ConsultarEstadoCuentaRequest): Observable<Blob> {
    let params = new HttpParams().set(
      'usuarioAccion',
      request.usuarioAccion || this.obtenerUsuarioActual()
    );

    if (request.IdSaldoCuenta) {
      params = params.set('IdSaldoCuenta', request.IdSaldoCuenta.toString());
    }
    if (request.IdPersona) {
      params = params.set('IdPersona', request.IdPersona.toString());
    }
    if (request.Nombre) {
      params = params.set('Nombre', request.Nombre);
    }
    if (request.Apellido) {
      params = params.set('Apellido', request.Apellido);
    }
    if (request.Desde) {
      params = params.set('Desde', request.Desde);
    }
    if (request.Hasta) {
      params = params.set('Hasta', request.Hasta);
    }

    return this.http.get(`${this.apiUrl}/ExportarCsv`, {
      params,
      responseType: 'blob',
    });
  }

  /**
   * Guarda el estado actual de la consulta
   */
  guardarEstadoConsulta(estado: EstadoConsulta): void {
    this.estadoConsultaSubject.next(estado);
  }

  /**
   * Obtiene el estado guardado de la consulta
   */
  obtenerEstadoConsulta(): EstadoConsulta | null {
    return this.estadoConsultaSubject.value;
  }

  /**
   * Limpia el estado guardado
   */
  limpiarEstadoConsulta(): void {
    this.estadoConsultaSubject.next(null);
  }
}
