import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResp, CrearMovimientoVm, TipoMovimientoDto } from '../movimientos/movimiento.models';

@Injectable({ providedIn: 'root' })
export class GrabacionMovimientoService {
  // Cambiar a la URL de producción cuando sea necesario
  // private baseUrl = 'http://smart.guateplast.com.gt:58096/GrabacionMovimiento';
  private baseUrl = 'http://localhost:54409/GrabacionMovimiento';

  constructor(private http: HttpClient) {}

  obtenerTipos(): Observable<TipoMovimientoDto[]> {
    return this.http
      .get<ApiResp<TipoMovimientoDto>>(`${this.baseUrl}/Tipos`)
      .pipe(map(r => (r.items ?? []) as TipoMovimientoDto[]));
  }

  cuentaActiva(idSaldoCuenta: number): Observable<ApiResp> {
    const params = new HttpParams().set('idSaldoCuenta', String(idSaldoCuenta));
    return this.http.get<ApiResp>(`${this.baseUrl}/CuentaActiva`, { params });
  }

  crear(data: CrearMovimientoVm): Observable<ApiResp> {
    return this.http.post<ApiResp>(`${this.baseUrl}/Crear`, data);
  }
}
