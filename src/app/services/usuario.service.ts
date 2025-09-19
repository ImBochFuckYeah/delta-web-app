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
   IdGenero: number;
  IdStatusUsuario: number;
  IdRole: number;
  TelefonoMovil: string;
  FechaCreacion: Date;
}

export interface UsuarioCrearRequest {
  IdUsuario: string;
  Nombre: string;
  Apellido: string;
  FechaNacimiento: string; // Cambiado a string para formato "yyyy-MM-dd"
  IdStatusUsuario?: number;
  Password: string;
  IdGenero?: number;
  CorreoElectronico: string;
  TelefonoMovil: string;
  IdSucursal?: number;
  Pregunta: string; // Ahora es requerido
  Respuesta: string; // Ahora es requerido
  IdRole?: number;
  FotografiaBase64?: string;
  UsuarioAccion?: string; // Agregado para auditoría
}

export interface UsuarioActualizarRequest {
  IdUsuario: string;
  Nombre?: string;
  Apellido?: string;
  FechaNacimiento?: string; // Cambiado a string
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
  UsuarioAccion?: string; // Agregado para auditoría
}

export interface UsuarioListarRequest {
  Buscar?: string;
  IdSucursal?: number;
  IdStatusUsuario?: number;
  IdRole?: number;
  Pagina?: number;
  TamanoPagina?: number;
  OrdenPor?: string;
  OrdenDir?: string;
}

export interface UsuarioEliminarRequest {
  IdUsuario: string;
  HardDelete?: boolean;
  UsuarioAccion?: string; // Agregado para auditoría
}

export interface CambiarPasswordRequest {
  IdUsuario: string;
  PasswordActual: string;
  PasswordNueva: string;
  UsuarioAccion?: string;
  DireccionIp?: string;
  UserAgent?: string;
}

export interface PagedResult<T> {
  Items: T[];
  Total: number;
}

export interface ApiResponse<T> {
  Exito: boolean;
  Mensaje: string;
  Datos?: T;
}

export interface ListarUsuariosResponse {
  Resultado: number;
  Mensaje: string;
  Pagina: number;
  TamanoPagina: number;
  Total: number;
  Items: UsuarioDto[];
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = 'http://smart.guateplast.com.gt:58096';

  constructor(private http: HttpClient) { }

  // Listar usuarios - CORREGIDO
  listar(request: UsuarioListarRequest): Observable<ListarUsuariosResponse> {
    let params = new HttpParams();

    if (request.Buscar) params = params.set('buscar', request.Buscar);
    if (request.IdSucursal) params = params.set('idSucursal', request.IdSucursal.toString());
    if (request.IdStatusUsuario) params = params.set('idStatusUsuario', request.IdStatusUsuario.toString());
    if (request.IdRole) params = params.set('idRole', request.IdRole.toString());
    if (request.Pagina) params = params.set('pagina', request.Pagina.toString());
    if (request.TamanoPagina) params = params.set('tamanoPagina', request.TamanoPagina.toString());
    if (request.OrdenPor) params = params.set('ordenPor', request.OrdenPor);
    if (request.OrdenDir) params = params.set('ordenDir', request.OrdenDir);

    return this.http.get<ListarUsuariosResponse>(`${this.baseUrl}/Usuarios/Listar`, { params });
  }

  // Obtener usuario por ID - CORREGIDO
  obtener(idUsuario: string): Observable<ApiResponse<UsuarioDto>> {
    return this.http.get<ApiResponse<UsuarioDto>>(`${this.baseUrl}/Usuarios/Obtener`, {
      params: { idUsuario }
    });
  }

  // Crear usuario - CORREGIDO (URL y estructura)
  crear(request: UsuarioCrearRequest): Observable<any> {
    // Asegurar campos requeridos
    const requestBody = {
      ...request,
      UsuarioAccion: request.UsuarioAccion || 'admin'
    };

    return this.http.post<any>(`${this.baseUrl}/Usuarios/Crear`, requestBody);
  }

  // Actualizar usuario - CORREGIDO
  actualizar(request: UsuarioActualizarRequest): Observable<any> {
    // Asegurar campos requeridos
    const requestBody = {
      ...request,
      UsuarioAccion: request.UsuarioAccion || 'admin'
    };

    return this.http.post<any>(`${this.baseUrl}/Usuarios/Actualizar`, requestBody);
  }

  // Eliminar usuario - CORREGIDO (ahora usa GET con parámetros)
  eliminar(request: UsuarioEliminarRequest): Observable<any> {
    let params = new HttpParams()
      .set('idUsuario', request.IdUsuario);

    if (request.HardDelete !== undefined) {
      params = params.set('hardDelete', request.HardDelete.toString());
    }
    if (request.UsuarioAccion) {
      params = params.set('usuarioAccion', request.UsuarioAccion);
    }

    return this.http.get<any>(`${this.baseUrl}/Usuarios/Eliminar`, { params });
  }

  // Cambiar password - MANTENIDO (si existe el endpoint)
  cambiarPassword(request: CambiarPasswordRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Usuarios/CambiarPassword`, request);
  }

  // Métodos para recuperación de contraseña - MANTENIDOS
  obtenerUsuario(correo: string): Observable<any> {
    const params = new HttpParams().set('correoElectronico', correo);
    return this.http.get<any>(`${this.baseUrl}/Usuarios/Obtener`, { params });
  }

  obtenerPregunta(usuario: string): Observable<any> {
    const params = new HttpParams().set('usuario', usuario);
    return this.http.get<any>(`${this.baseUrl}/PasswordQA/ObtenerPreguntas`, { params });
  }

  validarYActualizar(usuario: string, respuesta: string, nueva: string, ip = '10.0.0.10', ua = 'AngularApp'): Observable<any> {
    const params = new HttpParams()
      .set('usuario', usuario)
      .set('respuesta', respuesta)
      .set('nueva', nueva)
      .set('ip', ip)
      .set('ua', ua);

    return this.http.get<any>(`${this.baseUrl}/PasswordQA/ValidarYActualizar`, { params });
  }
}
