import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatusCuentaService, StatusCuenta } from '../services/status-cuenta.service';

@Component({
  selector: 'app-status-cuenta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './status-cuenta.component.html',
  styleUrls: ['./status-cuenta.component.scss']
})
export class StatusCuentaComponent implements OnInit {
  statusCuentas: StatusCuenta[] = [];
  statusCuentaSeleccionado: StatusCuenta | null = null;

  // Para el formulario
  nombre: string = '';
  modoEdicion: boolean = false;
  mostrarFormulario: boolean = false;

  // Para búsqueda y paginación
  buscar: string = '';
  paginaActual: number = 1;
  tamanoPagina: number = 10;
  totalRegistros: number = 0;

  // Estados
  cargando: boolean = false;
  mensaje: string = '';
  tipoMensaje: 'success' | 'error' | 'info' = 'info';

  constructor(private statusCuentaService: StatusCuentaService) {}

  ngOnInit(): void {
    this.cargarStatusCuentas();
  }

  /**
   * Cargar lista de status de cuentas con paginación
   */
  cargarStatusCuentas(): void {
    this.cargando = true;
    this.statusCuentaService.listarBusqueda(
      this.buscar,
      this.paginaActual,
      this.tamanoPagina
    ).subscribe({
      next: (response) => {
        if (response.Resultado === 1) {
          this.statusCuentas = response.Items || [];
          this.totalRegistros = response.Total || 0;
        } else {
          this.mostrarMensaje(response.Mensaje, 'error');
        }
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarMensaje('Error al cargar los status de cuentas', 'error');
        console.error(error);
        this.cargando = false;
      }
    });
  }

  /**
   * Buscar status de cuentas
   */
  buscarStatusCuentas(): void {
    this.paginaActual = 1;
    this.cargarStatusCuentas();
  }

  /**
   * Cambiar página
   */
  cambiarPagina(direccion: 'anterior' | 'siguiente'): void {
    if (direccion === 'anterior' && this.paginaActual > 1) {
      this.paginaActual--;
      this.cargarStatusCuentas();
    } else if (direccion === 'siguiente' && this.paginaActual < this.totalPaginas()) {
      this.paginaActual++;
      this.cargarStatusCuentas();
    }
  }

  /**
   * Calcular total de páginas
   */
  totalPaginas(): number {
    return Math.ceil(this.totalRegistros / this.tamanoPagina);
  }

  /**
   * Mostrar formulario para nuevo registro
   */
  nuevoStatusCuenta(): void {
    this.modoEdicion = false;
    this.nombre = '';
    this.statusCuentaSeleccionado = null;
    this.mostrarFormulario = true;
  }

  /**
   * Mostrar formulario para editar
   */
  editarStatusCuenta(statusCuenta: StatusCuenta): void {
    this.modoEdicion = true;
    this.nombre = statusCuenta.Nombre;
    this.statusCuentaSeleccionado = statusCuenta;
    this.mostrarFormulario = true;
  }

  /**
   * Guardar (crear o actualizar)
   */
  guardarStatusCuenta(): void {
    if (!this.nombre.trim()) {
      this.mostrarMensaje('El nombre es requerido', 'error');
      return;
    }

    this.cargando = true;

    if (this.modoEdicion && this.statusCuentaSeleccionado) {
      // Actualizar
      this.statusCuentaService.actualizar(
        this.statusCuentaSeleccionado.IdStatusCuenta!,
        this.nombre
      ).subscribe({
        next: (response) => {
          if (response.Resultado === 1) {
            this.mostrarMensaje('Status de cuenta actualizado correctamente', 'success');
            this.cancelar();
            this.cargarStatusCuentas();
          } else {
            this.mostrarMensaje(response.Mensaje, 'error');
          }
          this.cargando = false;
        },
        error: (error) => {
          this.mostrarMensaje('Error al actualizar', 'error');
          console.error(error);
          this.cargando = false;
        }
      });
    } else {
      // Crear
      this.statusCuentaService.crear(this.nombre).subscribe({
        next: (response) => {
          if (response.Resultado === 1) {
            this.mostrarMensaje('Status de cuenta creado correctamente', 'success');
            this.cancelar();
            this.cargarStatusCuentas();
          } else {
            this.mostrarMensaje(response.Mensaje, 'error');
          }
          this.cargando = false;
        },
        error: (error) => {
          this.mostrarMensaje('Error al crear', 'error');
          console.error(error);
          this.cargando = false;
        }
      });
    }
  }

  /**
   * Eliminar status de cuenta
   */
  eliminarStatusCuenta(statusCuenta: StatusCuenta): void {
    if (!confirm(`¿Está seguro de eliminar "${statusCuenta.Nombre}"?`)) {
      return;
    }

    this.cargando = true;
    this.statusCuentaService.eliminar(statusCuenta.IdStatusCuenta!).subscribe({
      next: (response) => {
        if (response.Resultado === 1) {
          this.mostrarMensaje('Status de cuenta eliminado correctamente', 'success');
          this.cargarStatusCuentas();
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
   * Cancelar formulario
   */
  cancelar(): void {
    this.mostrarFormulario = false;
    this.nombre = '';
    this.statusCuentaSeleccionado = null;
    this.modoEdicion = false;
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
      this.cargarStatusCuentas();
    }
  }
}
