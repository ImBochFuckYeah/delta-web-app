import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MenuService, MenuObj, MenuRequest } from '../../services/menu.service';
import { ModuloService, ModuloRequest } from '../../services/modulo.service';
import { ModuloNamePipe } from '../../pipes/modulo-name.pipe';

@Component({
  selector: 'app-menu-list.component',
  imports: [CommonModule, FormsModule, RouterLink, ModuloNamePipe],
  templateUrl: './menu-list.component.html',
  styleUrl: './menu-list.component.scss'
})
export class MenuListComponent implements OnInit {
  menus: MenuObj[] = [];
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  searchTerm = '';
  selectedModulo = '';
  loading = false;
  modulos: ModuloRequest[] = [];

  constructor(
    private menuService: MenuService,
    private moduloService: ModuloService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarModulos();
    this.cargarMenus();
  }

  cargarModulos(): void {
    this.moduloService.listar({ incluirAuditoria: false }).subscribe({
      next: (resp) => {
        if (resp.Resultado === 1 && resp.Items) {
          // Si es un array, usarlo directamente; si es un objeto, convertirlo a array
          this.modulos = Array.isArray(resp.Items) ? resp.Items : [resp.Items];
        } else {
          this.modulos = [];
        }
      },
      error: () => {
        this.modulos = [];
      }
    });
  }

  cargarMenus(): void {
    this.loading = true;
    
    const request: MenuRequest = {
      Pagina: this.currentPage,
      TamanoPagina: this.pageSize,
      OrdenPor: 'Nombre',
      OrdenDir: 'ASC'
    };

    if (this.searchTerm) {
      request.Buscar = this.searchTerm;
    }
    
    if (this.selectedModulo) {
      request.IdModulo = parseInt(this.selectedModulo);
    }

    this.menuService.listarBusqueda(request).subscribe({
      next: (resp) => {
        if (resp.Resultado === 1 && resp.Items) {
          // Maneja tanto arrays como objetos individuales
          this.menus = Array.isArray(resp.Items) ? resp.Items : [resp.Items];
          this.totalItems = this.menus.length;
        } else {
          this.menus = [];
          this.totalItems = 0;
        }
        this.loading = false;
      },
      error: () => {
        this.menus = [];
        this.totalItems = 0;
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.cargarMenus();
  }

  onModuloChange(): void {
    this.currentPage = 1;
    this.cargarMenus();
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.cargarMenus();
  }

  editarMenu(idMenu: number): void {
    this.router.navigate(['/app/menus/editar', idMenu]);
  }

  eliminarMenu(idMenu: number): void {
    if (confirm('¿Está seguro de eliminar este menú?')) {
      this.loading = true;
      const request: MenuRequest = {
        IdMenu: idMenu,
        Usuario: 'Administrador'
      };

      this.menuService.eliminar(request).subscribe({
        next: (resp) => {
          if (resp.ok || resp.Resultado === 1) {
            this.cargarMenus();
          } else {
            alert('Error: ' + (resp.error || resp.message || 'No se pudo eliminar el menú'));
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          alert('Error al eliminar el menú');
        }
      });
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize) || 1;
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}