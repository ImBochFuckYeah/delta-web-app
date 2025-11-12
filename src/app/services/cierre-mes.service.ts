import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces para tipar las respuestas
export interface PeriodoPendiente {
  Anio: number;
  Mes: number;
  FechaCierre: string | null;
}

export interface DetalleCierre {
  PeriodoAnio: number | null;
  PeriodoMes: number | null;
  HistoricosInsertados: number;
  CuentasProcesadas: number;
}

export interface ResponsePendientes {
  Resultado: number;
  Mensaje: string;
  Items?: PeriodoPendiente[];
}

export interface ResponseEjecutar {
  Resultado: number;
  Mensaje: string;
  Data?: DetalleCierre;
}

@Injectable({
  providedIn: 'root'
})
export class CierreMesService {
  private baseUrl = 'http://localhost:54409/CierreMes'; // Ajusta según tu proxy.conf.json

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de períodos pendientes de cierre (FechaCierre IS NULL)
   */
  obtenerPendientes(usuarioAccion: string): Observable<ResponsePendientes> {
    const params = new HttpParams().set('usuarioAccion', usuarioAccion);
    return this.http.get<ResponsePendientes>(`${this.baseUrl}/Pendientes`, { params });
  }

  /**
   * Ejecuta el proceso de cierre de mes
   */
  ejecutarCierre(usuario: string, anio: number, mes: number): Observable<ResponseEjecutar> {
    const params = new HttpParams()
      .set('Usuario', usuario)
      .set('Anio', anio.toString())
      .set('Mes', mes.toString());

    return this.http.post<ResponseEjecutar>(`${this.baseUrl}/Ejecutar`, null, { params });
  }
}
