import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RoleOpcionDto {
  IdRole: number;
  IdOpcion: number;
  NombreOpcion?: string;
  Alta: boolean;
  Baja: boolean;
  Cambio: boolean;
  Imprimir: boolean;
  Exportar: boolean;
  FechaCreacion?: string;
  UsuarioCreacion?: string;
  FechaModificacion?: string | null;
  UsuarioModificacion?: string | null;
   [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class RoleOpcionesService {
  private baseUrl = 'http://localhost:54409/RoleOpciones';

 //private baseUrl = 'http://smart.guateplast.com.gt:58096/RoleOpciones';

  constructor(private http: HttpClient) { }

  listar(idRole: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Listar`, {
      params: { IdRole: idRole.toString() }
    });
  }

  guardar(permiso: RoleOpcionDto): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Guardar`, permiso);
  }

  guardarMultiple(permisos: RoleOpcionDto[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/GuardarMultiple`, permisos);
  }
}
