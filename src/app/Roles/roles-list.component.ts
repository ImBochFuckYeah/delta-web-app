import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router, RouterLink } from '@angular/router';
import { RolesService, RolDto, RolListarRequest, RolesBackendResponse } from '../services/roles.service';


@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.css']
})
export class RolesListComponent implements OnInit {
  roles: RolDto[] = [];
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  searchTerm = '';
  loading = false;

  constructor(private rolesService: RolesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarRoles();
  }

  cargarRoles(): void {
    this.loading = true;
    const request: RolListarRequest = {
      Buscar: this.searchTerm,
      Pagina: this.currentPage,
      TamanoPagina: this.pageSize,
      usuarioAccion: ''
    };

    // console.log('Cargando roles...', request);

    this.rolesService.listar(request).subscribe({
      next: (response: RolesBackendResponse) => {
        // console.log('Respuesta del backend:', response);

        if (response.Mensaje === 'OK' && response.Resultado == 1) {
          this.roles = response.Items;
          this.totalItems = response.Items.length;
          // console.log('Roles cargados:', this.roles);
        } else {
          console.warn('Respuesta no exitosa:', response);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
        this.loading = false;
        alert('Error al cargar roles: ' + error.message);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.cargarRoles();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.cargarRoles();
  }

  eliminarRol(idRole: number): void {
    if (confirm('¿Está seguro de eliminar este rol?')) {
      this.rolesService.eliminar(idRole).subscribe({
        next: (response) => {
          if (response.Resultado === 1) {
            alert('Rol eliminado correctamente');
            this.cargarRoles();
          } else {
            alert('Error: ' + (response.mensaje || 'Error al eliminar'));
          }
        },
        error: (error) => {
          console.error('Error al eliminar rol:', error);
          alert('Error al eliminar rol');
        }
      });
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  editarPermisos(idRole: number): void {
    this.router.navigate(['/app/roles/permisos', idRole]);
  }

}
