import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { GenerosService, GeneroDto, GeneroListarRequest, GenerosBackendResponse } from '../services/genero.service';

@Component({
  selector: 'app-generos-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './generos-list.component.html',
  styleUrls: ['./generos-list.component.css']
})
export class GenerosListComponent implements OnInit {
  generos: GeneroDto[] = [];
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  searchTerm = '';
  loading = false;

  constructor(private generoService: GenerosService) { }

  ngOnInit(): void {
    this.cargarGeneros();
  }

  cargarGeneros(): void {
    this.loading = true;
    const request: GeneroListarRequest = {
      BuscarNombre: this.searchTerm,
      Pagina: this.currentPage,
      TamanoPagina: this.pageSize
    };

    this.generoService.listar(request).subscribe({
      next: (response: GenerosBackendResponse) => {
        if (response.ok && response.data) {
          this.generos = response.data;
          this.totalItems = response.data.length;
        } else {
          console.warn('Respuesta no exitosa:', response);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar géneros:', error);
        this.loading = false;
        alert('Error al cargar géneros: ' + error.message);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.cargarGeneros();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.cargarGeneros();
  }

  eliminarGenero(idGenero: number): void {
    if (confirm('¿Está seguro de eliminar este género?')) {
      this.generoService.eliminar(idGenero).subscribe({
        next: (response: any) => {
          if (response.ok) {
            alert('Género eliminado correctamente');
            this.cargarGeneros();
          } else {
            alert('Error: ' + (response.error || 'Error al eliminar'));
          }
        },
        error: (error) => {
          console.error('Error al eliminar género:', error);
          alert('Error al eliminar género');
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
