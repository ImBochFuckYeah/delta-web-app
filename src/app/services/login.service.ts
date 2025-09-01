import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginRequest {
  usuario: string;
  password: string;
}

export interface LoginDatos {
  idUsuario: string;
  nombre: string;
  apellido: string;
  correoElectronico: string;
  sesion: string;
  idSucursal: string;
}

export interface ApiResponse<T> {
  exito: boolean;
  mensaje: string;
  datos: T | null;
  debug?: any;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'https://localhost:44301/Login/ValidarCredenciales';

  constructor(private http: HttpClient) { }

  login(req: LoginRequest): Observable<ApiResponse<LoginDatos>> {
    return this.http.post<ApiResponse<LoginDatos>>(this.apiUrl, req);
  }
}
