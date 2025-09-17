import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface RolDto {
  IdRole: number;
  Nombre: string;
  FechaCreacion: string;
  UsuarioCreacion: string;
  FechaModificacion: string | null;
  UsuarioModificacion: string | null;
}

export interface RolListarRequest {
  Buscar?: string;
  Pagina?: number;
  TamanoPagina?: number;
}

// ✅ NUEVA interfaz que coincide con la respuesta real del backend
export interface RolesBackendResponse {
  ok: boolean;
  data: RolDto[];
}

export interface ApiResponse<T> {
  Exito: boolean;
  Mensaje: string;
  Datos?: T;
}

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  // private baseUrl = 'http://localhost:54409/Roles';
  private baseUrl = 'http://smart.guateplast.com.gt:58096/Roles';
  private rolesCache: any[] = [];

  constructor(private http: HttpClient) { }

  listar(request: RolListarRequest): Observable<RolesBackendResponse> {
    let params = new HttpParams();

    if (request.Buscar) params = params.set('BuscarNombre', request.Buscar);
    if (request.Pagina) params = params.set('Page', request.Pagina.toString());
    if (request.TamanoPagina) params = params.set('PageSize', request.TamanoPagina.toString());

    return this.http.get<RolesBackendResponse>(`${this.baseUrl}/Listar`, { params });
  }

  obtener(idRole: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Listar`, {
      params: { IdRole: idRole.toString() }
    }).pipe(
      map(response => ({
        Exito: response.ok,
        Mensaje: response.ok ? 'Éxito' : 'Error',
        Datos: response.data ? response.data[0] : null
      }))
    );
  }

  crear(nombre: string, usuario: string = 'admin'): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Crear`, {
      params: {
        Nombre: nombre,
        Usuario: usuario
      }
    });
  }

  actualizar(idRole: number, nombre: string, usuario: string = 'admin'): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Actualizar`, {
      params: {
        IdRole: idRole.toString(),
        Nombre: nombre,
        Usuario: usuario
      }
    });
  }

  eliminar(idRole: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Eliminar`, {
      params: { IdRole: idRole.toString() }
    });
  }

  obtenerTodosLosRoles(): Observable<any[]> {
    // Si ya tenemos los roles cacheados, devolverlos
    if (this.rolesCache.length > 0) {
      return of(this.rolesCache);
    }

    return this.http.get<any>(`${this.baseUrl}/Listar`).pipe(
      map(response => {
        if (response.ok && response.data) {
          this.rolesCache = response.data; // Cachear los roles
          return response.data; // ✅ Esto devuelve any[]
        }
        return [];
      }),
      catchError(error => {
        console.error('Error al obtener roles:', error);
        return of([]); // ✅ Esto devuelve any[]
      })
    );
  }

  // ✅ Método para limpiar cache (opcional)
  limpiarCache(): void {
    this.rolesCache = [];
  }
}





