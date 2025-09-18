import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RolesService } from '../services/roles.service';
import { RoleOpcionesService, RoleOpcionDto } from '../services/role-opciones.service';

@Component({
  selector: 'app-roles-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './roles-form.component.html',
  styleUrls: ['./roles-form.component.css']
})
export class RolesFormComponent implements OnInit {
  isEdit = false;
  loading = false;
  loadingPermisos = false;
  roleId: number = 0;
  mostrarPermisos = false;

  formData: any = {
    Nombre: '',
    UsuarioAccion: 'admin'
  };

  permisos: RoleOpcionDto[] = [];

  constructor(
    private rolesService: RolesService,
    private roleOpcionesService: RoleOpcionesService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.roleId = Number(this.route.snapshot.paramMap.get('id')) || 0;
    this.isEdit = this.roleId > 0;

    if (this.isEdit) {
      this.cargarRole();
    }
  }

  cargarRole(): void {
    this.loading = true;
    this.rolesService.obtener(this.roleId).subscribe({
      next: (response) => {
        if (response.Exito && response.Datos) {
          this.formData = {
            ...this.formData,
            ...response.Datos
          };
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar rol:', error);
        this.loading = false;
        alert('Error al cargar rol');
      }
    });
  }

  togglePermisos(): void {
    this.mostrarPermisos = !this.mostrarPermisos;
    if (this.mostrarPermisos && this.permisos.length === 0 && this.isEdit) {
      this.cargarPermisos();
    }
  }

  cargarPermisos(): void {
    this.loadingPermisos = true;
    this.roleOpcionesService.listar(this.roleId).subscribe({
      next: (response) => {
        if (response.ok && response.data) {
          this.permisos = response.data;
        } else {
          console.warn('Respuesta inesperada:', response);
        }
        this.loadingPermisos = false;
      },
      error: (error) => {
        console.error('Error al cargar permisos:', error);
        this.loadingPermisos = false;
        alert('Error al cargar permisos');
      }
    });
  }

  togglePermiso(permiso: RoleOpcionDto, campo: 'Alta' | 'Baja' | 'Cambio' | 'Imprimir' | 'Exportar'): void {
    permiso[campo] = !permiso[campo];
  }

  onSubmit(): void {
    if (!this.formData.Nombre) {
      alert('El nombre del rol es requerido');
      return;
    }

    this.loading = true;

    if (this.isEdit) {
      // Primero actualizar el nombre del rol
      this.rolesService.actualizar(
        this.roleId,
        this.formData.Nombre,
        this.formData.UsuarioAccion
      ).subscribe({
        next: (response) => {
          // Luego guardar los permisos si es necesario
          if (this.mostrarPermisos && this.permisos.length > 0) {
            this.guardarPermisos();
          } else {
            this.handleResponse(response);
          }
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    } else {
      // Crear nuevo rol
      this.rolesService.crear(
        this.formData.Nombre,
        this.formData.UsuarioAccion
      ).subscribe({
        next: (response) => {
          this.handleResponse(response);
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    }
  }

  guardarPermisos(): void {
    this.roleOpcionesService.guardarMultiple(this.permisos).subscribe({
      next: (response) => {
        if (response.ok) {
          alert('Rol y permisos actualizados correctamente');
          this.router.navigate(['/app/roles']);
        } else {
          alert('Error al guardar permisos: ' + response.message);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al guardar permisos:', error);
        alert('Error al guardar permisos');
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/app/roles']);
  }

  private handleResponse(response: any): void {
    this.loading = false;
    const exito = response.ok || response.Exito;
    const mensaje = response.Mensaje || response.message || 'Operación completada';

    if (exito) {
      alert('Operación realizada con éxito');
      this.router.navigate(['/app/roles']);
    } else {
      alert('Error: ' + mensaje);
    }
  }

  private handleError(error: any): void {
    this.loading = false;
    console.error('Error:', error);
    let errorMessage = 'Error en la operación';

    if (error.error?.Mensaje) {
      errorMessage = error.error.Mensaje;
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    alert(errorMessage);
  }
}
