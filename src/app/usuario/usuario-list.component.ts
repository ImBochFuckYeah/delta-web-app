import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UsuarioService, UsuarioDto, UsuarioListarRequest } from '../services/usuario.service';
import { SucursalService } from '../services/sucursal.service';
import { RolesService } from '../services/roles.service';
import { GenerosService } from '../services/genero.service';
import { StatusUsuariosService, StatusUsuarioListarRequest } from '../services/status-usuario.service';
import { SucursalNamePipe } from '../pipes/sucursal-name.pipe';
import { RoleNamePipe } from '../pipes/role-name.pipe';
import { StatusNamePipe } from '../pipes/status-name.pipe';

// Interfaces para tipado
interface CatalogoItem {
  id: number;
  nombre: string;
}

interface LoadingStates {
  usuarios: boolean;
  sucursales: boolean;
  roles: boolean;
  generos: boolean;
  status: boolean;
}

interface FilterOptions {
  searchTerm: string;
  sucursalId?: number;
  statusId?: number;
  roleId?: number;
}

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    SucursalNamePipe,
    RoleNamePipe,
    StatusNamePipe
  ],
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css']
})
export class UsuarioListComponent implements OnInit {
  // Datos principales
  usuarios: UsuarioDto[] = [];
  totalItems = 0;

  // Catálogos de datos
  sucursales: any[] = [];
  roles: any[] = [];
  generos: any[] = [];
  statusUsuarios: any[] = [];

  // Paginación
  currentPage = 1;
  pageSize = 10;
  searchTerm = '';

  // Estados de carga
  loading: LoadingStates = {
    usuarios: false,
    sucursales: false,
    roles: false,
    generos: false,
    status: false
  };

  // Filtros opcionales (para futuras mejoras)
  filters: FilterOptions = {
    searchTerm: ''
  };

  constructor(
    private usuarioService: UsuarioService,
    private sucursalService: SucursalService,
    private rolesService: RolesService,
    private generosService: GenerosService,
    private statusUsuariosService: StatusUsuariosService
  ) { }

  ngOnInit(): void {
    this.inicializarDatos();
  }

  private inicializarDatos(): void {
    // Cargar catálogos en paralelo
    this.cargarCatalogos();
    // Cargar usuarios
    this.cargarUsuarios();
  }

  private cargarCatalogos(): void {
    this.cargarSucursales();
    this.cargarGeneros();
    this.cargarRoles();
    this.cargarStatusUsuarios();
  }

  // Métodos de utilidad
  private mostrarError(mensaje: string): void {
    // TODO: Implementar toast notifications
    alert(mensaje);
  }

  private mostrarExito(mensaje: string): void {
    // TODO: Implementar toast notifications
    alert(mensaje);
  }

  private procesarRespuestaCatalogo(response: any, dataProperty: string): any[] {
    if (response?.ok && response[dataProperty]) {
      return response[dataProperty];
    }
    if (response?.Mensaje === "OK" && response.Items) {
      return response.Items;
    }
    return [];
  }

  cargarRoles(): void {
    this.loading.roles = true;
    this.rolesService.obtenerTodosLosRoles().subscribe({
      next: (response: any) => {
        // Manejar tanto array directo como objeto con Items
        if (Array.isArray(response)) {
          this.roles = response;
        } else if (response?.Items && Array.isArray(response.Items)) {
          this.roles = response.Items;
        } else {
          console.error('Los roles no tienen el formato esperado:', response);
          this.roles = [];
        }
        this.loading.roles = false;
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
        this.mostrarError('Error al cargar roles');
        this.roles = [];
        this.loading.roles = false;
      }
    });
  }

  cargarStatusUsuarios(): void {
    this.loading.status = true;
    const request: StatusUsuarioListarRequest = {
      Pagina: 1,
      TamanoPagina: 100
    };
    this.statusUsuariosService.listar(request).subscribe({
      next: (response) => {
        this.statusUsuarios = this.procesarRespuestaCatalogo(response, 'data');
        this.loading.status = false;
      },
      error: (error) => {
        console.error('Error al cargar estados de usuario:', error);
        this.mostrarError('Error al cargar estados de usuario');
        this.statusUsuarios = [];
        this.loading.status = false;
      }
    });
  }

  cargarGeneros(): void {
    this.loading.generos = true;
    this.generosService.listar({}).subscribe({
      next: (response) => {
        this.generos = this.procesarRespuestaCatalogo(response, 'Items');
        this.loading.generos = false;
      },
      error: (error) => {
        console.error('Error al cargar géneros:', error);
        this.mostrarError('Error al cargar géneros');
        this.generos = [];
        this.loading.generos = false;
      }
    });
  }

  cargarSucursales(): void {
    this.loading.sucursales = true;
    this.sucursalService.obtenerSucursales().subscribe({
      next: (response) => {
        this.sucursales = this.procesarRespuestaCatalogo(response, 'data');
        this.loading.sucursales = false;
      },
      error: (error) => {
        console.error('Error al cargar sucursales:', error);
        this.mostrarError('Error al cargar sucursales');
        this.sucursales = [];
        this.loading.sucursales = false;
      }
    });
  }

  cargarUsuarios(): void {
    this.loading.usuarios = true;
    const request: UsuarioListarRequest = {
      Buscar: this.searchTerm || undefined,
      Pagina: this.currentPage,
      TamanoPagina: this.pageSize
    };
    
    this.usuarioService.listar(request).subscribe({
      next: (response) => {
        if (response.Resultado === 1) {
          this.usuarios = response.Items || [];
          this.totalItems = response.Total || 0;
        } else {
          this.usuarios = [];
          this.totalItems = 0;
        }
        this.loading.usuarios = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.mostrarError('Error al cargar la lista de usuarios');
        this.usuarios = [];
        this.totalItems = 0;
        this.loading.usuarios = false;
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
    if (!confirm('¿Está seguro de eliminar este usuario?\n\nEsta acción no se puede deshacer.')) {
      return;
    }

    this.loading.usuarios = true;
    this.usuarioService.eliminar({ IdUsuario: idUsuario }).subscribe({
      next: (response) => {
        const exito = response?.Exito || response?.Resultado === 1;
        if (exito) {
          this.mostrarExito('Usuario eliminado correctamente');
          this.cargarUsuarios(); // Recargar la lista
        } else {
          this.mostrarError(`Error al eliminar: ${response?.Mensaje || 'Error desconocido'}`);
          this.loading.usuarios = false;
        }
      },
      error: (error) => {
        console.error('Error al eliminar usuario:', error);
        this.mostrarError('Error al eliminar el usuario');
        this.loading.usuarios = false;
      }
    });
  }

  // Getters para la paginación
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pages(): number[] {
    const maxPages = 5; // Mostrar máximo 5 páginas
    const total = this.totalPages;
    const current = this.currentPage;
    
    if (total <= maxPages) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    
    let start = Math.max(1, current - Math.floor(maxPages / 2));
    let end = Math.min(total, start + maxPages - 1);
    
    if (end - start + 1 < maxPages) {
      start = Math.max(1, end - maxPages + 1);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  get hasResults(): boolean {
    return this.usuarios.length > 0;
  }

  get isLoadingAny(): boolean {
    return Object.values(this.loading).some(estado => estado);
  }

  get startItem(): number {
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  // Métodos TrackBy para mejor performance
  trackByUsuario(index: number, usuario: UsuarioDto): string {
    return usuario.IdUsuario;
  }

  trackByPage(index: number, page: number): number {
    return page;
  }

  // Método para limpiar filtros
  limpiarFiltros(): void {
    this.searchTerm = '';
    this.filters.searchTerm = '';
    this.currentPage = 1;
    this.cargarUsuarios();
  }

  // Método para cambiar tamaño de página
  cambiarTamanoPagina(nuevoTamano: number): void {
    this.pageSize = nuevoTamano;
    this.currentPage = 1;
    this.cargarUsuarios();
  }
}
