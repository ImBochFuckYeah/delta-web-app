import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesService } from '../services/roles.service';
import { RoleOpcionesService, RoleOpcionDto } from '../services/role-opciones.service'; // ✅ Nombre correcto

@Component({
  selector: 'app-role-permisos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-permisos.component.html'
})
export class RolePermisosComponent implements OnInit {
  roleId: number = 0;
  roleNombre: string = '';
  permisos: RoleOpcionDto[] = [];
  loading = false;
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roleOpcionesService: RoleOpcionesService,
    private rolesService: RolesService
  ) { }

  ngOnInit(): void {
    this.roleId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;

    // Cargar nombre del rol
    this.rolesService.obtener(this.roleId).subscribe({
      next: (roleResponse) => {
        if (roleResponse.Exito && roleResponse.Datos) {
          this.roleNombre = roleResponse.Datos.Nombre;
        }

        // Cargar permisos
        this.roleOpcionesService.listar(this.roleId).subscribe({
          next: (permisosResponse) => {
            if (permisosResponse.ok) {
              this.permisos = permisosResponse.data;
            }
            this.loading = false;
          },
          error: (error) => {
            console.error('Error al cargar permisos:', error);
            this.loading = false;
            alert('Error al cargar permisos');
          }
        });
      },
      error: (error) => {
        console.error('Error al cargar rol:', error);
        this.loading = false;
        alert('Error al cargar información del rol');
      }
    });
  }

  togglePermiso(permiso: RoleOpcionDto, campo: 'Alta' | 'Baja' | 'Cambio' | 'Imprimir' | 'Exportar'): void {
    permiso[campo] = !permiso[campo];
  }

  guardarPermisos(): void {
    this.saving = true;

    this.roleOpcionesService.guardarMultiple(this.permisos).subscribe({
      next: (response) => {
        this.saving = false;
        if (response.ok) {
          alert('Permisos guardados correctamente');
        } else {
          alert('Error al guardar permisos: ' + response.message);
        }
      },
      error: (error) => {
        this.saving = false;
        console.error('Error al guardar permisos:', error);
        alert('Error al guardar permisos');
      }
    });
  }

  volver(): void {
    this.router.navigate(['/app/roles']);
  }
}
