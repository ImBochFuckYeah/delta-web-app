import { RolesService } from './../services/roles.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService, UsuarioDto, UsuarioListarRequest } from '../services/usuario.service';
import { RouterLink } from '@angular/router';
import { SucursalNamePipe } from '../pipes/sucursal-name.pipe';
import { SucursalService } from '../services/sucursal.service';
import { RoleNamePipe } from '../pipes/role-name.pipe';
// import { GeneroNamePipe } from '../pipes/genero-name.pipe';
import { GenerosService } from '../services/genero.service';
import { StatusNamePipe } from '../pipes/status-name.pipe';
import { StatusUsuariosService, StatusUsuarioListarRequest } from '../services/status-usuario.service';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    SucursalNamePipe,
    RoleNamePipe,
    StatusNamePipe,
    // GeneroNamePipe // Asegúrate de importar el pipe si lo usas en la vista
  ],
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css']
})
export class UsuarioListComponent implements OnInit {
  usuarios: UsuarioDto[] = [];
  sucursales: any[] = [];
  roles: any[] = [];
  generos: any[] = [];
  statusUsuarios: any[] = [];
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  searchTerm = '';
  loading = false;
  loadingSucursales = false;
  loadingRoles = false;
  loadingGeneros = false;
  loadingStatus = false;

  constructor(
    private usuarioService: UsuarioService,
    private sucursalService: SucursalService,
    private rolesService: RolesService,
    private generosService: GenerosService,
    private statusUsuariosService: StatusUsuariosService
  ) { }

  ngOnInit(): void {
    this.cargarSucursales();
    this.cargarGeneros();
    this.cargarRoles();
    this.cargarStatusUsuarios();
    this.cargarUsuarios();
  }

  cargarRoles(): void {
    this.loadingRoles = true;
    this.rolesService.obtenerTodosLosRoles().subscribe({
      next: (roles) => {
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
        this.roles = [];
      }
    });
  }

  cargarStatusUsuarios(): void {
    this.loadingStatus = true;
    const request: StatusUsuarioListarRequest = {
      Pagina: 1,
      TamanoPagina: 100
    };
    this.statusUsuariosService.listar(request).subscribe({
      next: (response) => {
        if (response.ok && response.data) {
          this.statusUsuarios = response.data;
        } else {
          console.error('Error al cargar status:', response.error);
          this.statusUsuarios = [];
        }
        this.loadingStatus = false;
      },
      error: (error) => {
        console.error('Error al cargar status:', error);
        this.loadingStatus = false;
        this.statusUsuarios = [];
      }
    });
  }

  cargarGeneros(): void {
    this.loadingGeneros = true;
    this.generosService.listar({}).subscribe({
      next: (response) => {
        if (response.ok && response.data) {
          this.generos = response.data;
        } else {
          console.error('Respuesta no ok:', response);
          this.generos = [];
        }
        this.loadingGeneros = false;
      },
      error: (error) => {
        console.error('Error al cargar géneros:', error);
        this.loadingGeneros = false;
        this.generos = [];
      }
    });
  }

  cargarSucursales(): void {
    this.loadingSucursales = true;
    this.sucursalService.obtenerSucursales().subscribe({
      next: (response) => {
        if (response.ok && response.data) {
          this.sucursales = response.data;
        } else {
          this.sucursales = [];
        }
        this.loadingSucursales = false;
      },
      error: (error) => {
        console.error('Error al cargar sucursales:', error);
        this.loadingSucursales = false;
        this.sucursales = [];
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
        if (response.Resultado === 1) {
          this.usuarios = response.Items;
          this.totalItems = response.Total;
        } else {
          this.usuarios = [];
          this.totalItems = 0;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.loading = false;
        this.usuarios = [];
        this.totalItems = 0;
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
