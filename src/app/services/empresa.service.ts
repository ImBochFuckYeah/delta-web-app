import { Injectable, Signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EmpresaObj {
  IdEmpresa?: number,
  Nombre: string,
  Direccion: string,
  Nit: string,
  PasswordCantidadMayusculas?: string,
  PasswordCantidadMinusculas?: string,
  PasswordCantidadCaracteresEspeciales?: string,
  PasswordCantidadCaducidadDias?: string,
  PasswordLargo?: string,
  PasswordIntentosAntesDeBloquear?: string,
  PasswordCantidadNumeros?: string,
  PasswordCantidadPreguntasValidar?: string,
  Usuario: string,
  // Agrega más campos según la respuesta real
}


export interface ListarEmpresasRequest {
  page: number,
  pageSize: number,
  buscarNombre?: string,
  Usuario?: string
}

export interface EmpresasResponse {
  ok: boolean,
  message?: string,
  id?: number,
  error?: string,
  data?: EmpresaObj[];
}

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private baseUrl = 'http://smart.guateplast.com.gt:58096/Empresas';

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

  crear(request: EmpresaObj): Observable<EmpresasResponse> {
    let params = new HttpParams()
      .set('Usuario', this.getUsuarioActual())
      .set('Nombre', request.Nombre)
      .set('Direccion', request.Direccion)
      .set('Nit', request.Nit)
      .set('PasswordCantidadMayusculas', request.PasswordCantidadMayusculas!)
      .set('PasswordCantidadMinusculas', request.PasswordCantidadMinusculas!)
      .set('PasswordCantidadCaracteresEspeciales', request.PasswordCantidadCaracteresEspeciales!)
      .set('PasswordCantidadCaducidadDias', request.PasswordCantidadCaducidadDias!)
      .set('PasswordLargo', request.PasswordLargo!)
      .set('PasswordIntentosAntesDeBloquear', request.PasswordIntentosAntesDeBloquear!)
      .set('PasswordCantidadNumeros', request.PasswordCantidadNumeros!)
      .set('PasswordCantidadPreguntasValidar', request.PasswordCantidadPreguntasValidar!);
    return this.http.get<EmpresasResponse>(`${this.baseUrl}/Crear`, { params });
  }

  listar(request: ListarEmpresasRequest): Observable<EmpresasResponse> {
    let params = new HttpParams()
    if (request.page) params = params.set('Page', request.page.toString())
    if (request.pageSize) params = params.set('PageSize', request.pageSize.toString());
    if (request.buscarNombre) params = params.set('BuscarNombre', request.buscarNombre.toString());

    return this.http.get<EmpresasResponse>(`${this.baseUrl}/Listar`, { params });
  }

  obtener(id: number): Observable<EmpresasResponse> {
    let params = new HttpParams();
    if (id) params = params.set('idEmpresa', id.toString());
    return this.http.get<EmpresasResponse>(`${this.baseUrl}/Listar`, { params });
  }

  eliminar(idEmpresa: number, usuario: string): Observable<EmpresasResponse> {
    return this.http.get<any>(`${this.baseUrl}/Eliminar`, {
      params: { IdEmpresa: idEmpresa, Usuario: usuario }
    });
  }

  actualizar(request: EmpresaObj): Observable<EmpresasResponse> {
    let params = new HttpParams()
      .set('Usuario', this.getUsuarioActual())
      .set('idEmpresa', request.IdEmpresa!)
      .set('Nombre', request.Nombre)
      .set('Direccion', request.Direccion)
      .set('Nit', request.Nit)
      .set('PasswordCantidadMayusculas', request.PasswordCantidadMayusculas!)
      .set('PasswordCantidadMinusculas', request.PasswordCantidadMinusculas!)
      .set('PasswordCantidadCaracteresEspeciales', request.PasswordCantidadCaracteresEspeciales!)
      .set('PasswordCantidadCaducidadDias', request.PasswordCantidadCaducidadDias!)
      .set('PasswordLargo', request.PasswordLargo!)
      .set('PasswordIntentosAntesDeBloquear', request.PasswordIntentosAntesDeBloquear!)
      .set('PasswordCantidadNumeros', request.PasswordCantidadNumeros!)
      .set('PasswordCantidadPreguntasValidar', request.PasswordCantidadPreguntasValidar!)
      .set('Usuario', request.Usuario);
    return this.http.get<EmpresasResponse>(`${this.baseUrl}/Actualizar`, { params });
  }

  // usado en servicios externos
  listarSinParametros(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Listar?Page=1&PageSize=100`);
  }
}
