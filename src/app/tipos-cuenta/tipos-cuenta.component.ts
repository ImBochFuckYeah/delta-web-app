import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipoSaldoCuentaService, TipoSaldoCuenta } from '../services/tipo-saldo-cuenta.service';

@Component({
  selector: 'app-tipos-cuenta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tipos-cuenta.component.html',
  styleUrls: ['./tipos-cuenta.component.scss']
})
export class TiposCuentaComponent implements OnInit {
  tiposCuenta: TipoSaldoCuenta[] = [];
  tipoCuentaSeleccionado: TipoSaldoCuenta | null = null;

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

  constructor(private tipoSaldoCuentaService: TipoSaldoCuentaService) {}

  ngOnInit(): void {
    this.cargarTiposCuenta();
  }

  /**
   * Cargar lista de tipos de cuenta con paginación
   */
  cargarTiposCuenta(): void {
    this.cargando = true;
    this.tipoSaldoCuentaService.listarBusqueda(
      this.buscar,
      this.paginaActual,
      this.tamanoPagina
    ).subscribe({
      next: (response) => {
        if (response.Resultado === 1) {
          this.tiposCuenta = response.Items || [];
          this.totalRegistros = response.Total || 0;
        } else {
          this.mostrarMensaje(response.Mensaje, 'error');
        }
        this.cargando = false;
      },
      error: (error) => {
        this.mostrarMensaje('Error al cargar los tipos de cuenta', 'error');
        console.error(error);
        this.cargando = false;
      }
    });
  }

  /**
   * Buscar tipos de cuenta
   */
  buscarTiposCuenta(): void {
    this.paginaActual = 1;
    this.cargarTiposCuenta();
  }

  /**
   * Cambiar página
   */
  cambiarPagina(direccion: 'anterior' | 'siguiente'): void {
    if (direccion === 'anterior' && this.paginaActual > 1) {
      this.paginaActual--;
      this.cargarTiposCuenta();
    } else if (direccion === 'siguiente' && this.paginaActual < this.totalPaginas()) {
      this.paginaActual++;
      this.cargarTiposCuenta();
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
  nuevoTipoCuenta(): void {
    this.modoEdicion = false;
    this.nombre = '';
    this.tipoCuentaSeleccionado = null;
    this.mostrarFormulario = true;
  }

  /**
   * Mostrar formulario para editar
   */
  editarTipoCuenta(tipoCuenta: TipoSaldoCuenta): void {
    this.modoEdicion = true;
    this.nombre = tipoCuenta.Nombre;
    this.tipoCuentaSeleccionado = tipoCuenta;
    this.mostrarFormulario = true;
  }

  /**
   * Guardar (crear o actualizar)
   */
  guardarTipoCuenta(): void {
    if (!this.nombre.trim()) {
      this.mostrarMensaje('El nombre es requerido', 'error');
      return;
    }

    this.cargando = true;

    if (this.modoEdicion && this.tipoCuentaSeleccionado) {
      // Actualizar
      this.tipoSaldoCuentaService.actualizar(
        this.tipoCuentaSeleccionado.IdTipoSaldoCuenta!,
        this.nombre
      ).subscribe({
        next: (response) => {
          if (response.Resultado === 1) {
            this.mostrarMensaje('Tipo de cuenta actualizado correctamente', 'success');
            this.cancelar();
            this.cargarTiposCuenta();
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
      this.tipoSaldoCuentaService.crear(this.nombre).subscribe({
        next: (response) => {
          if (response.Resultado === 1) {
            this.mostrarMensaje('Tipo de cuenta creado correctamente', 'success');
            this.cancelar();
            this.cargarTiposCuenta();
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
   * Eliminar tipo de cuenta
   */
  eliminarTipoCuenta(tipoCuenta: TipoSaldoCuenta): void {
    if (!confirm(`¿Está seguro de eliminar "${tipoCuenta.Nombre}"?`)) {
      return;
    }

    this.cargando = true;
    this.tipoSaldoCuentaService.eliminar(tipoCuenta.IdTipoSaldoCuenta!).subscribe({
      next: (response) => {
        if (response.Resultado === 1) {
          this.mostrarMensaje('Tipo de cuenta eliminado correctamente', 'success');
          this.cargarTiposCuenta();
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
    this.tipoCuentaSeleccionado = null;
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
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      // Mostrar páginas con puntos suspensivos si son muchas
      if (actual <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push(-1); // -1 representa "..."
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
      this.cargarTiposCuenta();
    }
  }
}
