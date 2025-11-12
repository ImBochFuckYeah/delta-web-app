// src/app/services/grabacion-movimiento.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResp, CrearMovimientoVm, TipoMovimientoDto } from '../movimientos/movimiento.models';

@Injectable({ providedIn: 'root' })
export class GrabacionMovimientoService {
  private baseUrl = 'http://localhost:54409';

  constructor(private http: HttpClient) {}

  /** 🔹 Listar tipos de movimiento desde TiposMovimientoCXC/ListarBusqueda */
  obtenerTipos(): Observable<TipoMovimientoDto[]> {
    let params = new HttpParams()
      .set('usuarioAccion', 'Administrador')
      .set('Buscar', '')
      .set('Pagina', '1')
      .set('TamanoPagina', '50')
      .set('OrdenPor', 'Nombre')
      .set('OrdenDir', 'ASC');

    return this.http
      .get<any>(`${this.baseUrl}/TiposMovimientoCXC/ListarBusqueda`, { params })
      .pipe(map((r) => (r.Items ?? []) as TipoMovimientoDto[]));
  }

  /** 🔹 Verifica si una cuenta está activa */
  cuentaActiva(idSaldoCuenta: number): Observable<ApiResp> {
    const params = new HttpParams().set('idSaldoCuenta', String(idSaldoCuenta));
    return this.http.get<ApiResp>(`${this.baseUrl}/GrabacionMovimiento/CuentaActiva`, { params });
  }

  /** 🔹 Crear movimiento en la API real */
  crear(data: CrearMovimientoVm): Observable<ApiResp> {
    return this.http.post<ApiResp>(`${this.baseUrl}/GrabacionMovimiento/Crear`, data);
  }
}
