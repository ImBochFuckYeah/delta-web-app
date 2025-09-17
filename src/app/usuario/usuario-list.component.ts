import { RolesService } from './../services/roles.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService, UsuarioDto, UsuarioListarRequest, PagedResult } from '../services/usuario.service';
import { RouterLink } from '@angular/router';
import { SucursalNamePipe } from '../pipes/sucursal-name.pipe';
import { SucursalService } from '../services/sucursal.service';
import { RoleNamePipe } from '../pipes/role-name.pipe';
//import { RolesService } from '../services/roles.service';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink,SucursalNamePipe, RoleNamePipe],
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css']
})
export class UsuarioListComponent implements OnInit {
  usuarios: UsuarioDto[] = [];
  sucursales: any[] = [];
  roles: any [] = [];
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
 // searchTerm = 'admin';
searchTerm = '';
  loading = false;
  loadingSucursales = false;
  loadingRoles = false;

  constructor(private usuarioService: UsuarioService,
    private sucursalService: SucursalService,
    private rolesService: RolesService

  ) { }

  ngOnInit(): void {
    this.cargarSucursales();
    this.cargarRoles();
    this.cargarUsuarios();

  }

cargarRoles(): void {
  this.loadingRoles = true;
  this.rolesService.obtenerTodosLosRoles().subscribe({
    next: (roles) => {
      console.log('Roles recibidos:', roles); // ✅ Debug
      console.log('Tipo de datos:', typeof roles); // ✅ Debug
      console.log('Es array?', Array.isArray(roles)); // ✅ Debug

      if (Array.isArray(roles)) {
        this.roles = roles;
      } else {
        console.error('Los roles no son un array:', roles);
        this.roles = [];
      }

      this.loadingRoles = false;
    },
    error: (error) => {
      console.error('Error al cargar roles:', error);
      this.loadingRoles = false;
    }
  });
}

  cargarSucursales(): void {
    this.loadingSucursales = true;
    this.sucursalService.obtenerSucursales().subscribe({
      next: (response) => {
        if (response.ok) {
          this.sucursales = response.data;
        }
        this.loadingSucursales = false;
      },
      error: (error) => {
        console.error('Error al cargar sucursales:', error);
        this.loadingSucursales = false;
      }
    });
  }

cargarUsuarios(): void {
  this.loading = true;
  const request: UsuarioListarRequest = {
    Buscar: this.searchTerm,
    Pagina: this.currentPage,
    TamanoPagina: this.pageSize
  };

  this.usuarioService.listar(request).subscribe({
    next: (response) => {
      if (response.Resultado === 1) { // Ahora usa Resultado en lugar de Exito
        this.usuarios = response.Items;
        this.totalItems = response.Total;
      }
      this.loading = false;
    },
    error: (error) => {
      console.error('Error al cargar usuarios:', error);
      this.loading = false;
    }
  });
}

  onSearch(): void {
    this.currentPage = 1;
    this.cargarUsuarios();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.cargarUsuarios();
  }

  eliminarUsuario(idUsuario: string): void {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      this.usuarioService.eliminar({ IdUsuario: idUsuario }).subscribe({
        next: (response) => {
          if (response.Exito) {
            alert('Usuario eliminado correctamente');
            this.cargarUsuarios();
          } else {
            alert('Error: ' + response.Mensaje);
          }
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          alert('Error al eliminar usuario');
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
}
