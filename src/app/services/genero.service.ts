import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GeneroDto {
  IdGenero: number;
  Nombre: string;
  FechaCreacion: string;
  UsuarioCreacion: string;
  FechaModificacion: string | null;
  UsuarioModificacion: string | null;
}

export interface GeneroListarRequest {
  IdGenero?: number;
  BuscarNombre?: string;
  Pagina?: number;
  TamanoPagina?: number;
}

export interface GenerosBackendResponse {
  ok: boolean;
  data: GeneroDto[];
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GenerosService {
  private apiUrl = 'http://localhost:54409/Generos'; // Ajusta según tu configuración de rutas

  constructor(private http: HttpClient) { }

  listar(request: GeneroListarRequest): Observable<GenerosBackendResponse> {
    let params = new HttpParams();

    if (request.IdGenero) params = params.set('IdGenero', request.IdGenero.toString());
    if (request.BuscarNombre) params = params.set('BuscarNombre', request.BuscarNombre);
    if (request.Pagina) params = params.set('Page', request.Pagina.toString());
    if (request.TamanoPagina) params = params.set('PageSize', request.TamanoPagina.toString());

    return this.http.get<GenerosBackendResponse>(`${this.apiUrl}/Listar`, { params });
  }

  obtener(id: number): Observable<GenerosBackendResponse> {
    return this.http.get<GenerosBackendResponse>(`${this.apiUrl}/Listar`, {
      params: { IdGenero: id.toString() }
    });
  }

  crear(nombre: string, usuario: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Crear`, {
      params: { Nombre: nombre, Usuario: usuario }
    });
  }

  actualizar(id: number, nombre: string, usuario: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/Actualizar`, {
      params: { IdGenero: id.toString(), Nombre: nombre, Usuario: usuario }
    });
  }

  eliminar(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/Eliminar`, {
      params: { IdGenero: id.toString() }
    });
  }
}
