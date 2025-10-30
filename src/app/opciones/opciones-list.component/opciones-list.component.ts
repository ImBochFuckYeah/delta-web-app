import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { OpcionesService, OpcionesObj, OpcionesRequest } from '../../services/opciones.service';
import { MenuService, MenuObj } from '../../services/menu.service';
import { MenuNamePipe } from '../../pipes/menu-name.pipe';

@Component({
  selector: 'app-opciones-list.component',
  imports: [CommonModule, FormsModule, RouterLink, MenuNamePipe],
  templateUrl: './opciones-list.component.html',
  styleUrl: './opciones-list.component.scss'
})
export class OpcionesListComponent implements OnInit {
  opciones: OpcionesObj[] = [];
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  searchTerm = '';
  selectedMenu = '';
  loading = false;
  menus: MenuObj[] = [];

  constructor(
    private opcionesService: OpcionesService,
    private menuService: MenuService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarMenus();
    this.cargarOpciones();
  }

  cargarMenus(): void {
    this.menuService.listarBusqueda({
      usuarioAccion: 'Administrador',
      Pagina: 1,
      TamanoPagina: 100,
      OrdenPor: 'Nombre',
      OrdenDir: 'ASC'
    }).subscribe({
      next: (resp) => {
        if (resp.Resultado === 1 && resp.Items) {
          this.menus = Array.isArray(resp.Items) ? resp.Items : [resp.Items];
        } else {
          this.menus = [];
        }
      },
      error: () => {
        this.menus = [];
      }
    });
  }

  cargarOpciones(): void {
    this.loading = true;
    
    const request: OpcionesRequest = {
      usuarioAccion: 'Administrador',
      Pagina: this.currentPage,
      TamanoPagina: this.pageSize,
      OrdenPor: 'Nombre',
      OrdenDir: 'ASC'
    };

    if (this.searchTerm) {
      request.Buscar = this.searchTerm;
    }
    
    if (this.selectedMenu) {
      request.IdMenu = parseInt(this.selectedMenu);
    }

    this.opcionesService.listarBusqueda(request).subscribe({
      next: (resp) => {
        if (resp.Resultado === 1 && resp.Items) {
          this.opciones = Array.isArray(resp.Items) ? resp.Items : [resp.Items];
          // Si la API devuelve Total, usarlo; sino usar la longitud actual para mostrar al menos los items
          this.totalItems = resp.Total || this.opciones.length;
        } else {
          this.opciones = [];
          this.totalItems = 0;
        }
        this.loading = false;
      },
      error: () => {
        this.opciones = [];
        this.totalItems = 0;
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.cargarOpciones();
  }

  onMenuChange(): void {
    this.currentPage = 1;
    this.cargarOpciones();
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.cargarOpciones();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.cargarOpciones();
  }

  editarOpcion(idOpcion: number): void {
    this.router.navigate(['/app/opciones/editar', idOpcion]);
  }

  eliminarOpcion(idOpcion: number): void {
    if (confirm('¿Está seguro de eliminar esta opción?')) {
      this.loading = true;
      const request: OpcionesRequest = {
        IdOpcion: idOpcion,
        Usuario: 'Administrador'
      };

      this.opcionesService.eliminar(request).subscribe({
        next: (resp) => {
          if (resp.ok || resp.Resultado === 1) {
            this.cargarOpciones();
          } else {
            alert('Error: ' + (resp.error || resp.Mensaje || 'No se pudo eliminar la opción'));
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          alert('Error al eliminar la opción');
        }
      });
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize) || 1;
  }

  get pages(): number[] {
    const maxPagesToShow = 5;
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    
    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  get startItem(): number {
    return Math.min((this.currentPage - 1) * this.pageSize + 1, this.totalItems);
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }
}