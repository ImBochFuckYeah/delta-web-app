import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  //private baseUrl = '/Usuario';
  // En usuario.service.ts
private baseUrl = 'http://localhost:54409/Usuario';

// Y habilita CORS en el backend como se indicó arriba

  constructor(private http: HttpClient) { }

  // Listar usuarios
  listar(request: UsuarioListarRequest): Observable<ApiResponse<PagedResult<UsuarioDto>>> {
    let params = new HttpParams();
    if (request.Buscar) params = params.set('buscar', request.Buscar);
    if (request.Pagina) params = params.set('pagina', request.Pagina.toString());
    if (request.TamanoPagina) params = params.set('tamanoPagina', request.TamanoPagina.toString());

    return this.http.get<ApiResponse<PagedResult<UsuarioDto>>>(`${this.baseUrl}/Listar`, { params });
  }

  // Obtener usuario por ID
  obtener(idUsuario: string): Observable<ApiResponse<UsuarioDto>> {
    return this.http.get<ApiResponse<UsuarioDto>>(`${this.baseUrl}/Obtener`, {
      params: { idUsuario }
    });
  }

  // Crear usuario
  crear(request: UsuarioCrearRequest): Observable<ApiResponse<UsuarioDto>> {
    return this.http.post<ApiResponse<UsuarioDto>>(`${this.baseUrl}/Crear`, request);
  }

  // Actualizar usuario
  actualizar(request: UsuarioActualizarRequest): Observable<ApiResponse<UsuarioDto>> {
    return this.http.post<ApiResponse<UsuarioDto>>(`${this.baseUrl}/Actualizar`, request);
  }

  // Eliminar usuario
  eliminar(request: UsuarioEliminarRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/Eliminar`, request);
  }

  // Cambiar password
  cambiarPassword(request: CambiarPasswordRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/CambiarPassword`, request);
  }
}
