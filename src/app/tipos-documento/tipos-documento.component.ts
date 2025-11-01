import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TipoDocumentoService, TipoDocumento } from '../services/tipo-documento.service';

@Component({
  selector: 'app-tipos-documento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tipos-documento.component.html',
  styleUrls: ['./tipos-documento.component.scss']
})
export class TiposDocumentoComponent implements OnInit {
  tiposDocumento: TipoDocumento[] = [];

  // Para búsqueda y paginación
  buscar: string = '';
  paginaActual: number = 1;
  tamanoPagina: number = 10;
  totalRegistros: number = 0;

  // Estados
  cargando: boolean = false;
  mensaje: string = '';
  tipoMensaje: 'success' | 'error' | 'info' = 'info';

  constructor(
    private tipoDocumentoService: TipoDocumentoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarTiposDocumento();
  }

  /**
   * Cargar lista de tipos de documento con paginación
   */
  cargarTiposDocumento(): void {
    this.cargando = true;
    this.tipoDocumentoService.listarBusqueda(
      this.buscar,
      this.paginaActual,
      this.tamanoPagina
    ).subscribe({
      next: (response) => {
        if (response.Resultado === 1) {
          this.tiposDocumento = response.Items || [];
          this.totalRegistros = response.Total || 0;
        } else {
          this.mostrarMensaje(response.Mensaje, 'error');
        }
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarMensaje('Error al cargar los tipos de documento', 'error');
        console.error(error);
        this.cargando = false;
      }
    });
  }

  /**
   * Buscar tipos de documento
   */
  buscarTiposDocumento(): void {
    this.paginaActual = 1;
    this.cargarTiposDocumento();
  }

  /**
   * Cambiar página
   */
  cambiarPagina(direccion: 'anterior' | 'siguiente'): void {
    if (direccion === 'anterior' && this.paginaActual > 1) {
      this.paginaActual--;
      this.cargarTiposDocumento();
    } else if (direccion === 'siguiente' && this.paginaActual < this.totalPaginas()) {
      this.paginaActual++;
      this.cargarTiposDocumento();
    }
  }

  /**
   * Calcular total de páginas
   */
  totalPaginas(): number {
    return Math.ceil(this.totalRegistros / this.tamanoPagina);
  }

  /**
   * Navegar para crear nuevo tipo de documento
   */
  nuevoTipoDocumento(): void {
    this.router.navigate(['/app/tipos-documento/crear']);
  }

  /**
   * Navegar para editar tipo de documento
   */
  editarTipoDocumento(tipoDocumento: TipoDocumento): void {
    this.router.navigate(['/app/tipos-documento/editar', tipoDocumento.IdTipoDocumento]);
  }

  /**
   * Eliminar tipo de documento
   */
  eliminarTipoDocumento(tipoDocumento: TipoDocumento): void {
    if (!confirm(`¿Está seguro de eliminar "${tipoDocumento.Nombre}"?`)) {
      return;
    }

    this.cargando = true;
    this.tipoDocumentoService.eliminar(tipoDocumento.IdTipoDocumento!).subscribe({
      next: (response) => {
        if (response.Resultado === 1) {
          this.mostrarMensaje('Tipo de documento eliminado correctamente', 'success');
          this.cargarTiposDocumento();
        } else {
          this.mostrarMensaje(response.Mensaje, 'error');
        }
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarMensaje('Error al eliminar', 'error');
        console.error(error);
        this.cargando = false;
      }
    });
  }

  /**
   * Mostrar mensaje
   */
  mostrarMensaje(texto: string, tipo: 'success' | 'error' | 'info'): void {
    this.mensaje = texto;
    this.tipoMensaje = tipo;
    setTimeout(() => {
      this.mensaje = '';
    }, 4000);
  }

  /**
   * Obtener array de páginas para mostrar en paginación
   */
  getPaginasArray(): number[] {
    const total = this.totalPaginas();
    const actual = this.paginaActual;
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (actual <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push(-1);
        pages.push(total);
      } else if (actual >= total - 2) {
        pages.push(1);
        pages.push(-1);
        for (let i = total - 4; i <= total; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1);
        for (let i = actual - 1; i <= actual + 1; i++) pages.push(i);
        pages.push(-1);
        pages.push(total);
      }
    }

    return pages;
  }

  /**
   * Ir a una página específica
   */
  irAPagina(pagina: number): void {
    if (pagina > 0 && pagina <= this.totalPaginas() && pagina !== this.paginaActual) {
      this.paginaActual = pagina;
      this.cargarTiposDocumento();
    }
  }
}
