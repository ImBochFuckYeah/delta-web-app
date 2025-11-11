// src/app/services/grabacion-movimiento.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResp, CrearMovimientoVm, TipoMovimientoDto } from '../movimientos/movimiento.models';

@Injectable({ providedIn: 'root' })
export class GrabacionMovimientoService {
  private base = '/api/GrabacionMovimiento';

  constructor(private http: HttpClient) {}

  obtenerTipos(): Observable<TipoMovimientoDto[]> {
    return this.http
      .get<ApiResp<TipoMovimientoDto>>(`${this.base}/Tipos`)
      .pipe(map(r => (r.items ?? []) as TipoMovimientoDto[]));
  }

  cuentaActiva(idSaldoCuenta: number): Observable<ApiResp> {
    const params = new HttpParams().set('idSaldoCuenta', String(idSaldoCuenta));
    return this.http.get<ApiResp>(`${this.base}/CuentaActiva`, { params });
  }

  crear(data: CrearMovimientoVm): Observable<ApiResp> {
    return this.http.post<ApiResp>(`${this.base}/Crear`, data);
  }
}
