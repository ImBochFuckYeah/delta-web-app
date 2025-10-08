import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RolesService } from '../services/roles.service';
import { RoleOpcionesService, RoleOpcionDto } from '../services/role-opciones.service';

@Component({
  selector: 'app-roles-crear',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles-crear.component.html'
})
export class RolesCrearComponent implements OnInit {
  loading = false;
  loadingOpciones = false;
  opcionesDisponibles: any[] = [];
  permisosSeleccionados: RoleOpcionDto[] = [];

  formData: any = {
    Nombre: '',
    UsuarioAccion: 'admin'
  };

  constructor(
    private rolesService: RolesService,
    private roleOpcionesService: RoleOpcionesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarOpcionesDisponibles();
  }

  cargarOpcionesDisponibles(): void {
    this.loadingOpciones = true;

    this.opcionesDisponibles = [
      { IdOpcion: 1, Nombre: 'Usuarios' },
      { IdOpcion: 2, Nombre: 'Roles' },
      { IdOpcion: 3, Nombre: 'Reportes' },
      { IdOpcion: 4, Nombre: 'Configuración' }
    ];

    // Inicializar permisos por defecto (todos desactivados)
    this.permisosSeleccionados = this.opcionesDisponibles.map(opcion => ({
      IdRole: 0, // Se asignará después
      IdOpcion: opcion.IdOpcion,
      NombreOpcion: opcion.Nombre,
      Alta: false,
      Baja: false,
      Cambio: false,
      Imprimir: false,
      Exportar: false
    }));

    this.loadingOpciones = false;
  }

  togglePermiso(opcionId: number, campo: string): void {
    const permiso = this.permisosSeleccionados.find(p => p.IdOpcion === opcionId);
    if (permiso) {
      permiso[campo] = !permiso[campo];
    }
  }

  onSubmit(): void {
    if (!this.formData.Nombre) {
      alert('El nombre del rol es requerido');
      return;
    }

    this.loading = true;

    this.rolesService.crearConPermisos(
      this.formData.Nombre,
      this.formData.UsuarioAccion,
      this.permisosSeleccionados
    ).subscribe({
      next: (response) => {
        this.loading = false;
        console.log('Respuesta del servidor:', response);
        if (response.Resultado === 1) {
          alert('Rol creado con permisos correctamente');
          this.router.navigate(['/app/roles']);
        } else {
          alert('Error: ' + (response.mensaje || 'Error al crear rol'));
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error al crear rol:', error);
        alert('Error al crear rol');
      }
    });
  }
  getPermiso(opcionId: number): RoleOpcionDto | undefined {
  return this.permisosSeleccionados.find(p => p.IdOpcion === opcionId);
}

  onCancel(): void {
    this.router.navigate(['/app/roles']);
  }
}
