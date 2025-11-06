import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SaldoCuentaObj {
  IdSaldoCuenta: number;
  IdPersona: number;
  NombrePersona: string;
  TipoSaldoCuenta: string;
  EstadoCuenta: string;
  SaldoAnterior: number;
  Debitos: number;
  Creditos: number;
  SaldoActual: number;
  FechaCreacion: string;
  UsuarioCreacion: string;
}

export interface ConsultaSaldosRequest {
  buscar?: string;
  idPersona?: number;
  idStatusCuenta?: number;
  idTipoSaldoCuenta?: number;
  pagina?: number;
  tamanoPagina?: number;
}

export interface SaldosResponse {
  ok: boolean;
  message?: string;
  error?: string;
  data?: SaldoCuentaObj[];
  Resultado?: number;
  Mensaje?: string;
  Pagina?: number;
  TamanoPagina?: number;
  Total?: number;
  Items?: SaldoCuentaObj[];
}

@Injectable({
  providedIn: 'root'
})
export class SaldosService {
  // Cambia el puerto según tu configuración
  private baseUrl = 'http://localhost:54409/Cuentas';

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

  consultarSaldos(request: ConsultaSaldosRequest): Observable<SaldosResponse> {
    let params = new HttpParams()
      .set('usuarioAccion', this.getUsuarioActual())
      .set('Pagina', (request.pagina || 1).toString())
      .set('TamanoPagina', (request.tamanoPagina || 50).toString());

    if (request.buscar) {
      params = params.set('Buscar', request.buscar);
    }
    if (request.idPersona) {
      params = params.set('IdPersona', request.idPersona.toString());
    }
    if (request.idStatusCuenta) {
      params = params.set('IdStatusCuenta', request.idStatusCuenta.toString());
    }
    if (request.idTipoSaldoCuenta) {
      params = params.set('IdTipoSaldoCuenta', request.idTipoSaldoCuenta.toString());
    }

    return this.http.get<SaldosResponse>(`${this.baseUrl}/ListarBusqueda`, { params });
  }

  obtenerSaldo(idSaldoCuenta: number): Observable<SaldosResponse> {
    let params = new HttpParams()
      .set('usuarioAccion', this.getUsuarioActual())
      .set('IdSaldoCuenta', idSaldoCuenta.toString());

    return this.http.get<SaldosResponse>(`${this.baseUrl}/Obtener`, { params });
  }
}
