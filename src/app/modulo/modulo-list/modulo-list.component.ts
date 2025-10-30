import { Component, OnInit } from '@angular/core';
import { ModuloService, ModuloRequest, ModuloResponse } from '../../services/modulo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-modulo-list.component',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './modulo-list.component.html',
  styleUrl: './modulo-list.component.scss'
})
export class ModuloListComponent implements OnInit {
  modulos: ModuloRequest[] = [];
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  searchTerm = '';
  loading = false;

  constructor(private moduloService: ModuloService, private router: Router) { }

  ngOnInit(): void {
    this.cargarModulos();
  }

  cargarModulos(): void {
    this.loading = true;
    const request: ModuloRequest = {
      Pagina: this.currentPage,
      TamanoPagina: this.pageSize,
      Nombre: this.searchTerm
    };
    this.moduloService.listar(request).subscribe({
      next: (response) => {
        if (response.Mensaje === 'OK' && response.Resultado == 1) {
          this.modulos = Array.isArray(response.Items) ? response.Items : (response.Items ? [response.Items] : []);
          this.totalItems = response.Items?.length ?? this.modulos.length;
        } else {
          this.modulos = [];
          this.totalItems = 0;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.cargarModulos();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.cargarModulos();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  editarModulo(idModulo: number): void {
    this.router.navigate(['/app/modulos/editar', idModulo]);
  }

  eliminarModulo(idModulo: number): void {
    if (confirm('¿Está seguro de eliminar este módulo?')) {
      this.moduloService.eliminar({ IdModulo: idModulo }).subscribe({
        next: (response) => {
          if (response && response.Resultado === 1) {
            alert('Módulo eliminado correctamente');
            this.cargarModulos();
          } else {
            alert('Error: ' + (response?.Mensaje || 'No se pudo eliminar el módulo'));
          }
        },
        error: () => {
          alert('Error al eliminar módulo');
        }
      });
    }
  }
}
