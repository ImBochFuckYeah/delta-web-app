import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PersonaDto {
  IdPersona?: number;
  Nombre: string;
  Apellido?: string;
  FechaNacimiento?: string;
  IdGenero?: number | null;
  Direccion?: string;
  Telefono?: string;
  CorreoElectronico?: string;
  IdEstadoCivil?: number | null;
  DocumentosJson?: string;
}

export interface CuentaDto {
  IdSaldoCuenta?: number;
  IdPersona: number;
  IdTipoSaldoCuenta: number;
  IdStatusCuenta: number;
  SaldoAnterior: number;
  NoCuenta?: string;
}

export interface MovimientoDto {
  IdSaldoCuenta: number;
  TipoMovimiento: 'D' | 'C';
  Monto: number;
  Descripcion?: string;
}

@Injectable({ providedIn: 'root' })
export class GestionService {
  // =========================
  // 🔧 Configura aquí tus entornos
  // =========================

  // 🔹 Producción
  // private baseUrl = 'http://smart.guateplast.com.gt:58096';

  // 🔹 Local (para pruebas)
  private baseUrl = 'http://localhost:54409';

  // =========================
  // Endpoints base
  // =========================
  private personasBase = `${this.baseUrl}/Personas`;
  private cuentasBase = `${this.baseUrl}/Cuentas`;
  private estadoCuentaBase = `${this.baseUrl}/EstadoCuenta`;

  constructor(private http: HttpClient) {}

  // =========== PERSONAS ===========
  listarPersonas(usuarioAccion: string, buscar: string = '', pagina = 1, tamano = 50,
                 idGenero?: number, idEstadoCivil?: number): Observable<any> {
    let params = new HttpParams()
      .set('usuarioAccion', usuarioAccion)
      .set('Buscar', buscar)
      .set('Pagina', pagina)
      .set('TamanoPagina', tamano)
      .set('OrdenPor', 'FechaCreacion')
      .set('OrdenDir', 'DESC');
    if (idGenero != null) params = params.set('IdGenero', String(idGenero));
    if (idEstadoCivil != null) params = params.set('IdEstadoCivil', String(idEstadoCivil));
    return this.http.get(`${this.personasBase}/ListarBusqueda`, { params });
  }

  obtenerPersona(usuarioAccion: string, IdPersona?: number, CorreoElectronico?: string, incluirDocs = true): Observable<any> {
    let params = new HttpParams()
      .set('usuarioAccion', usuarioAccion)
      .set('IncluirDocumentos', incluirDocs);
    if (IdPersona) params = params.set('IdPersona', IdPersona);
    if (CorreoElectronico) params = params.set('CorreoElectronico', CorreoElectronico);
    return this.http.get(`${this.personasBase}/Obtener`, { params });
  }

  crearPersona(model: PersonaDto, usuario: string): Observable<any> {
    return this.http.post(`${this.personasBase}/Crear`, { ...model, Usuario: usuario });
  }

  actualizarPersona(model: PersonaDto & { IdPersona: number }, usuario: string, reemplazarDocs = false): Observable<any> {
    return this.http.post(`${this.personasBase}/Actualizar`, { ...model, Usuario: usuario, ReemplazarDocumentos: reemplazarDocs });
  }

  eliminarPersona(usuario: string, idPersona: number): Observable<any> {
    const params = new HttpParams().set('Usuario', usuario).set('IdPersona', idPersona);
    return this.http.delete(`${this.personasBase}/Eliminar`, { params });
  }

  // =========== CUENTAS ===========
  listarCuentas(usuarioAccion: string, opts: { IdPersona?: number; Buscar?: string; Pagina?: number; TamanoPagina?: number } = {}): Observable<any> {
    let params = new HttpParams().set('usuarioAccion', usuarioAccion);
    if (opts.IdPersona) params = params.set('IdPersona', opts.IdPersona);
    if (opts.Buscar) params = params.set('Buscar', opts.Buscar);
    params = params.set('Pagina', String(opts.Pagina ?? 1))
                   .set('TamanoPagina', String(opts.TamanoPagina ?? 50))
                   .set('OrdenPor', 'FechaCreacion')
                   .set('OrdenDir', 'DESC');
    return this.http.get(`${this.cuentasBase}/ListarBusqueda`, { params });
  }

  obtenerCuentaPorNo(usuarioAccion: string, noCuenta: string): Observable<any> {
    const params = new HttpParams().set('usuarioAccion', usuarioAccion).set('NoCuenta', noCuenta);
    return this.http.get(`${this.cuentasBase}/Obtener`, { params });
  }

  consultarSaldo(usuarioAccion: string, idSaldoCuenta: number): Observable<any> {
    const params = new HttpParams().set('usuarioAccion', usuarioAccion).set('IdSaldoCuenta', idSaldoCuenta);
    return this.http.get(`${this.cuentasBase}/ConsultarSaldo`, { params });
  }

  crearCuenta(model: CuentaDto, usuario: string): Observable<any> {
    return this.http.post(`${this.cuentasBase}/crear`, { ...model, Usuario: usuario });
  }

  // actualizarCuenta(model: CuentaDto & { IdSaldoCuenta: number }, usuario: string): Observable<any> {
  //   return this.http.post(`${this.cuentasBase}/Actualizar`, { ...model, Usuario: usuario });
  // }

//   actualizarCuenta(model: CuentaDto & { IdSaldoCuenta: number }, usuario: string): Observable<any> {
//   const params = new HttpParams()
//     .set('IdSaldoCuenta', model.IdSaldoCuenta.toString())
//     .set('Usuario', usuario)
//     .set('IdStatusCuenta', model.IdStatusCuenta?.toString() || '')
//     .set('SaldoAnterior', model.SaldoAnterior?.toString() || '');

//   return this.http.post(`${this.cuentasBase}/Actualizar`, null, { params });
// }
actualizarCuenta(model: CuentaDto & { IdSaldoCuenta: number }, usuario: string): Observable<any> {
  const params = new HttpParams()
    .set('IdSaldoCuenta', model.IdSaldoCuenta.toString())
    .set('Usuario', usuario)
    .set('IdStatusCuenta', model.IdStatusCuenta?.toString() || '')
    .set('SaldoAnterior', model.SaldoAnterior?.toString() || '');

  return this.http.post(`${this.cuentasBase}/Actualizar`, null, { params });
}



  listarMovimientos(usuarioAccion: string, idSaldoCuenta: number,
                    desde?: string, hasta?: string, pagina = 1, tamano = 50, ordenDir: 'ASC'|'DESC' = 'DESC'): Observable<any> {
    let params = new HttpParams().set('usuarioAccion', usuarioAccion).set('IdSaldoCuenta', idSaldoCuenta);
    if (desde) params = params.set('Desde', desde);
    if (hasta) params = params.set('Hasta', hasta);
    params = params.set('Pagina', pagina).set('TamanoPagina', tamano).set('OrdenDir', ordenDir);
    return this.http.get(`${this.estadoCuentaBase}/Consultar`, { params });
  }

  guardarMovimiento(model: MovimientoDto, usuario: string): Observable<any> {
    return this.http.post(`${this.cuentasBase}/GuardarMovimiento`, { ...model, Usuario: usuario });
  }
  obtenerCuenta(usuarioAccion: string, idSaldoCuenta: number): Observable<any> {
  const params = new HttpParams()
    .set('usuarioAccion', usuarioAccion)
    .set('IdSaldoCuenta', idSaldoCuenta);
  return this.http.get(`${this.cuentasBase}/Obtener`, { params });
}

obtenerDocumentosPersona(usuarioAccion: string, idPersona: number): Observable<any> {
  const params = new HttpParams()
    .set('usuarioAccion', usuarioAccion)
    .set('IdPersona', idPersona)
    .set('IncluirDocumentos', true);
  return this.http.get(`${this.personasBase}/Obtener`, { params });
}

obtenerCuentaPorPersonaTipo(usuarioAccion: string, idPersona: number, idTipoSaldoCuenta: number): Observable<any> {
  const params = new HttpParams()
    .set('usuarioAccion', usuarioAccion)
    .set('IdPersona', idPersona)
    .set('IdTipoSaldoCuenta', idTipoSaldoCuenta);

  return this.http.get(`${this.cuentasBase}/Obtener`, { params });
}


}
