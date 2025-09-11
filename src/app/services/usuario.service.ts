import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

// Interfaces
export interface UsuarioDto {
  IdUsuario: string;
  Nombre: string;
  Apellido: string;
  CorreoElectronico: string;
  IdSucursal: number;
  IdStatusUsuario: number;
  IdRole: number;
  TelefonoMovil: string;
  FechaCreacion: Date;
}

export interface UsuarioCrearRequest {
  IdUsuario: string;
  Nombre: string;
  Apellido: string;
  FechaNacimiento?: Date;
  IdStatusUsuario?: number;
  Password: string;
  IdGenero?: number;
  CorreoElectronico: string;
  TelefonoMovil: string;
  IdSucursal?: number;
  Pregunta?: string;
  Respuesta?: string;
  IdRole?: number;
  FotografiaBase64?: string;
}

export interface UsuarioActualizarRequest {
  IdUsuario: string;
  Nombre?: string;
  Apellido?: string;
  FechaNacimiento?: Date;
  IdStatusUsuario?: number;
  Password?: string;
  IdGenero?: number;
  CorreoElectronico?: string;
  TelefonoMovil?: string;
  IdSucursal?: number;
  Pregunta?: string;
  Respuesta?: string;
  IdRole?: number;
  FotografiaBase64?: string;
  LimpiarFoto?: boolean;
}

export interface UsuarioListarRequest {
  Buscar?: string;
  Pagina?: number;
  TamanoPagina?: number;
}

export interface UsuarioEliminarRequest {
  IdUsuario: string;
  HardDelete?: boolean;
}

export interface CambiarPasswordRequest {
  IdUsuario: string;
  PasswordActual: string;
  PasswordNueva: string;
}

export interface PagedResult<T> {
  Items: T[];
  Total: number;
}

export interface ApiResponse<T> {
  Exito: boolean;
  Mensaje: string;
  Datos: T;
}

export interface UsuarioData {
  IdUsuario: string;
  Nombre?: string;
  Apellido?: string;
  FechaNacimiento?: string;
  IdStatusUsuario?: number;
  IdGenero?: number;
  CorreoElectronico?: string;
  TelefonoMovil?: string;
  IdSucursal?: number;
  Pregunta?: string;
  IdRole?: number;
  UltimaFechaIngreso?: string;
  IntentosDeAcceso?: number;
  SesionActual?: string;
  UltimaFechaCambioPassword?: string;
  FotografiaBase64?: string | null;
  FechaCreacion?: string | null;
  UsuarioCreacion?: string | null;
  FechaModificacion?: string | null;
  UsuarioModificacion?: string | null;
}

export interface ObtenerUsuarioResponse {
  Resultado: number;
  Mensaje: string;
  Data?: UsuarioData;
}

export interface ObtenerPreguntaResponse {
  Exito: number;
  Mensaje: string;
  Pregunta?: string;
  IdStatusUsuario?: number;
}

export interface ValidarActualizarResponse {
  Exito: number;
  Mensaje: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  //private baseUrl = '/Usuario';
  // En usuario.service.ts
  // private baseUrl = 'http://localhost:54409';
  private baseUrl = 'http://smart.guateplast.com.gt:58096';

  // Y habilita CORS en el backend como se indicó arriba

  constructor(private http: HttpClient) { }

  // Listar usuarios
  listar(request: UsuarioListarRequest): Observable<ApiResponse<PagedResult<UsuarioDto>>> {
    let params = new HttpParams();
    if (request.Buscar) params = params.set('buscar', request.Buscar);
    if (request.Pagina) params = params.set('pagina', request.Pagina.toString());
    if (request.TamanoPagina) params = params.set('tamanoPagina', request.TamanoPagina.toString());

    return this.http.get<ApiResponse<PagedResult<UsuarioDto>>>(`${this.baseUrl}/Usuario/Listar`, { params });
  }

  // Obtener usuario por ID
  obtener(idUsuario: string): Observable<ApiResponse<UsuarioDto>> {
    return this.http.get<ApiResponse<UsuarioDto>>(`${this.baseUrl}/Usuario/Obtener`, {
      params: { idUsuario }
    });
  }

  // Crear usuario
  crear(request: UsuarioCrearRequest): Observable<ApiResponse<UsuarioDto>> {
    return this.http.post<ApiResponse<UsuarioDto>>(`${this.baseUrl}/Usuario/Crear`, request);
  }

  // Actualizar usuario
  actualizar(request: UsuarioActualizarRequest): Observable<ApiResponse<UsuarioDto>> {
    return this.http.post<ApiResponse<UsuarioDto>>(`${this.baseUrl}/Usuario/Actualizar`, request);
  }

  // Eliminar usuario
  eliminar(request: UsuarioEliminarRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/Usuario/Eliminar`, request);
  }

  // Cambiar password
  cambiarPassword(request: CambiarPasswordRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/Usuario/CambiarPassword`, request);
  }

  obtenerUsuario(correo: string): Observable<ObtenerUsuarioResponse> {
    const url = `${this.baseUrl}/Usuarios/Obtener`;
    const params = new HttpParams().set('correoElectronico', correo);
    return this.http.get<ObtenerUsuarioResponse>(url, { params }).pipe(
      catchError(err => {
        console.error('obtenerUsuario error', err);
        return throwError(() => new Error(err?.message || 'Error al obtener usuario'));
      })
    );
  }

  obtenerPregunta(usuario: string): Observable<ObtenerPreguntaResponse> {
    const url = `${this.baseUrl}/PasswordQA/ObtenerPreguntas`;
    const params = new HttpParams().set('usuario', usuario);
    return this.http.get<ObtenerPreguntaResponse>(url, { params }).pipe(
      catchError(err => {
        console.error('obtenerPregunta error', err);
        return throwError(() => new Error(err?.message || 'Error al obtener pregunta'));
      })
    );
  }

  validarYActualizar(usuario: string, respuesta: string, nueva: string, ip = '10.0.0.10', ua = 'AngularApp'): Observable<ValidarActualizarResponse> {
    const url = `${this.baseUrl}/PasswordQA/ValidarYActualizar`;
    const params = new HttpParams()
      .set('usuario', usuario)
      .set('respuesta', respuesta)
      .set('nueva', nueva)
      .set('ip', ip)
      .set('ua', ua);
    return this.http.get<ValidarActualizarResponse>(url, { params }).pipe(
      catchError(err => {
        console.error('validarYActualizar error', err);
        return throwError(() => new Error(err?.message || 'Error al actualizar contraseña'));
      })
    );
  }
}
