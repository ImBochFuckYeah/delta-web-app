import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  EstadoCivilService,
  EstadoCivilDto,
  EstadoCivilListarRequest,
  EstadosCivilesBackendResponse
} from '../services/estado-civil.service';


@Component({
  selector: 'app-estado-civil-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './estado-civil-list.html',
  styleUrls: ['./estado-civil-list.css']
})
export class EstadoCivilListComponent implements OnInit {
  estadosCiviles: EstadoCivilDto[] = [];
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  searchTerm = '';
  loading = false;

  constructor(private estadoCivilService: EstadoCivilService) {}

  ngOnInit(): void {
    this.cargarEstadosCiviles();
  }

  cargarEstadosCiviles(): void {
    this.loading = true;
    const request: EstadoCivilListarRequest = {
      BuscarNombre: this.searchTerm,
      Pagina: this.currentPage,
      TamanoPagina: this.pageSize
    };

    this.estadoCivilService.listar(request).subscribe({
      next: (response: EstadosCivilesBackendResponse) => {
        if (response?.Mensaje === 'OK' && response?.Resultado === 1) {
          this.estadosCiviles = Array.isArray(response.Items) ? response.Items : [];
          this.totalItems = (response as any).TotalItems ?? this.estadosCiviles.length;
        } else {
          console.warn('Respuesta no exitosa:', response);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar estados civiles:', error);
        this.loading = false;
        alert('Error al cargar estados civiles: ' + (error?.message || ''));
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.cargarEstadosCiviles();
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.cargarEstadosCiviles();
  }

  eliminarEstadoCivil(id: number): void {
    if (confirm('¿Está seguro de eliminar este estado civil?')) {
      this.estadoCivilService.eliminar(id).subscribe({
  next: (r) => {
    if (r.ok) {
      alert('Estado civil eliminado correctamente');
      this.cargarEstadosCiviles();
    } else {
      alert(r.Mensaje || 'No se pudo eliminar');
    }
  },
  error: (e) => {
    const msg = e?.error?.Mensaje || e?.message || 'Error al eliminar estado civil';
    alert(msg);
  }
});

    }
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  /** 👇 Aquí agregas este método */
  trackById(index: number, item: EstadoCivilDto): number {
    return item.IdEstadoCivil;
  }
}
