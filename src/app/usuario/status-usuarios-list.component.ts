import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StatusUsuariosService, StatusUsuarioDto, StatusUsuarioListarRequest, StatusUsuariosBackendResponse } from '../services/status-usuario.service';

//import { StatusUsuarioListarRequest } from '../services/status-usuario.service';
@Component({
  selector: 'app-status-usuarios-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './status-usuarios-list.component.html',
  styleUrls: ['./status-usuarios-list.component.css']
})
export class StatusUsuariosListComponent implements OnInit {
  statusUsuarios: StatusUsuarioDto[] = [];
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  searchTerm = '';
  loading = false;

  constructor(private statusUsuariosService: StatusUsuariosService) { }

  ngOnInit(): void {
    this.cargarStatusUsuarios();
  }

  cargarStatusUsuarios(): void {
    this.loading = true;
    const request: StatusUsuarioListarRequest = {
      BuscarNombre: this.searchTerm,
      Pagina: this.currentPage,
      TamanoPagina: this.pageSize
    };

    // console.log('Cargando status usuarios...', request);

    this.statusUsuariosService.listar(request).subscribe({
      next: (response: StatusUsuariosBackendResponse) => {
        // console.log('Respuesta del backend:', response);

        if (response.ok && response.data) {
          this.statusUsuarios = response.data;
          this.totalItems = response.data.length;
          // console.log('Status usuarios cargados:', this.statusUsuarios);
        } else {
          console.warn('Respuesta no exitosa:', response);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar status usuarios:', error);
        this.loading = false;
        alert('Error al cargar status usuarios: ' + error.message);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.cargarStatusUsuarios();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.cargarStatusUsuarios();
  }

  eliminarStatusUsuario(idStatusUsuario: number): void {
    if (confirm('¿Está seguro de eliminar este status usuario?')) {
      this.statusUsuariosService.eliminar(idStatusUsuario).subscribe({
        next: (response) => {
          if (response.ok) {
            alert('Status usuario eliminado correctamente');
            this.cargarStatusUsuarios();
          } else {
            alert('Error: ' + (response.mensaje || 'Error al eliminar'));
          }
        },
        error: (error) => {
          console.error('Error al eliminar status usuario:', error);
          alert('Error al eliminar status usuario');
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
