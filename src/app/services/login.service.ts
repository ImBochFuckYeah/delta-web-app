import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginRequest {
  Usuario: string;
  Password: string;
}

export interface LoginDatos {
  IdUsuario: string;
  Nombre: string;
  Apellido: string;
  CorreoElectronico: string;
  Sesion: string;
  IdSucursal: string;
}

export interface ApiResponse<T> {
  Exito: boolean;
  Mensaje: string;
  Datos: T | null;
  Debug?: any;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://smart.guateplast.com.gt:58096/Login/ValidarCredenciales';
  // http://localhost:54409/Login/ValidarCredenciales

  constructor(private http: HttpClient) { }

  login(req: LoginRequest): Observable<ApiResponse<LoginDatos>> {
    return this.http.post<ApiResponse<LoginDatos>>(this.apiUrl, req);
  }
}
