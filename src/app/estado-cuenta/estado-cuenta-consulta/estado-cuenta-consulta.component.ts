import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  EstadoCuentaService,
  ConsultarEstadoCuentaRequest,
  EstadoCuentaHeader,
  EstadoCuentaItem,
  EstadoCuentaTotales
} from '../../services/estado-cuenta.service';

@Component({
  selector: 'app-estado-cuenta-consulta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estado-cuenta-consulta.component.html',
  styleUrl: './estado-cuenta-consulta.component.scss'
})
export class EstadoCuentaConsultaComponent implements OnInit, OnDestroy {
  // Filtros de búsqueda
  filtros = {
    IdSaldoCuenta: undefined as number | undefined,
    IdPersona: undefined as number | undefined,
    Nombre: '',
    Apellido: '',
    Desde: '',
    Hasta: ''
  };

  // Datos del estado de cuenta
  header: EstadoCuentaHeader | null = null;
  items: EstadoCuentaItem[] = [];
  totales: EstadoCuentaTotales | null = null;

  // Control de estado
  loading = false;
  mostrarResultados = false;
  mensaje = '';
  tipoMensaje: 'success' | 'error' | 'info' = 'info';

  // Paginación
  currentPage = 1;
  pageSize = 50;

  private subscription?: Subscription;

  constructor(
    private estadoCuentaService: EstadoCuentaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Intentar recuperar el estado guardado primero
    const estadoGuardado = this.estadoCuentaService.obtenerEstadoConsulta();

    if (estadoGuardado && estadoGuardado.mostrarResultados) {
      // Restaurar el estado completo de la búsqueda anterior
      this.filtros = { ...estadoGuardado.filtros };
      this.header = estadoGuardado.header;
      this.items = estadoGuardado.items;
      this.totales = estadoGuardado.totales;
      this.mostrarResultados = estadoGuardado.mostrarResultados;

      console.log('Estado recuperado exitosamente');
    } else {
      // Si no hay estado guardado, establecer fechas por defecto (mes actual)
      const hoy = new Date();
      const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

      this.filtros.Desde = this.formatearFecha(primerDia);
      this.filtros.Hasta = this.formatearFecha(ultimoDia);
    }
  }

  ngOnDestroy(): void {
    // Limpiar suscripción si existe
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Formatea una fecha a 'yyyy-MM-dd'
   */
  private formatearFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Valida que al menos un filtro esté presente
   */
  private validarFiltros(): boolean {
    return !!(
      this.filtros.IdSaldoCuenta ||
      this.filtros.IdPersona ||
      (this.filtros.Nombre && this.filtros.Nombre.trim()) ||
      (this.filtros.Apellido && this.filtros.Apellido.trim())
    );
  }

  /**
   * Realiza la búsqueda del estado de cuenta
   */
  buscar(): void {
    if (!this.validarFiltros()) {
      this.mostrarMensaje('Debe ingresar al menos un criterio de búsqueda (ID Cuenta, ID Cliente, Nombre o Apellido)', 'error');
      return;
    }

    this.loading = true;
    this.mostrarResultados = false;
    this.mensaje = '';

    const request: ConsultarEstadoCuentaRequest = {
      usuarioAccion: this.obtenerUsuarioActual(),
      IdSaldoCuenta: this.filtros.IdSaldoCuenta || undefined,
      IdPersona: this.filtros.IdPersona || undefined,
      Nombre: this.filtros.Nombre.trim() || undefined,
      Apellido: this.filtros.Apellido.trim() || undefined,
      Desde: this.filtros.Desde || undefined,
      Hasta: this.filtros.Hasta || undefined,
      Pagina: this.currentPage,
      TamanoPagina: this.pageSize,
      OrdenDir: 'ASC'
    };

    this.estadoCuentaService.consultar(request).subscribe({
      next: (response) => {
        if (response.Resultado === 1) {
          this.header = response.Header || null;
          this.items = response.Items || [];
          this.totales = response.Totales || null;
          this.mostrarResultados = true;

          // NUEVO: Guardar el estado de la consulta en el servicio
          this.guardarEstadoActual();

          if (this.items.length === 0) {
            this.mostrarMensaje('No se encontraron movimientos para el período seleccionado', 'info');
          }
        } else {
          this.mostrarMensaje(response.Mensaje || 'Error al consultar el estado de cuenta', 'error');
        }
        this.loading = false;
      },
      error: (error) => {
        this.mostrarMensaje('Error de conexión al consultar el estado de cuenta', 'error');
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  /**
   * Guarda el estado actual en el servicio
   */
  private guardarEstadoActual(): void {
    this.estadoCuentaService.guardarEstadoConsulta({
      filtros: { ...this.filtros },
      header: this.header,
      items: this.items,
      totales: this.totales,
      mostrarResultados: this.mostrarResultados
    });
  }

  /**
   * Limpia los filtros
   */
  limpiar(): void {
    // Restablecer fechas por defecto
    const hoy = new Date();
    const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

    this.filtros = {
      IdSaldoCuenta: undefined,
      IdPersona: undefined,
      Nombre: '',
      Apellido: '',
      Desde: this.formatearFecha(primerDia),
      Hasta: this.formatearFecha(ultimoDia)
    };

    this.mostrarResultados = false;
    this.header = null;
    this.items = [];
    this.totales = null;
    this.mensaje = '';

    // Limpiar el estado guardado en el servicio
    this.estadoCuentaService.limpiarEstadoConsulta();
  }

  /**
   * Exporta el estado de cuenta a CSV
   */
  exportarCsv(): void {
    if (!this.validarFiltros()) {
      this.mostrarMensaje('Debe realizar una búsqueda antes de exportar', 'error');
      return;
    }

    this.loading = true;

    const request: ConsultarEstadoCuentaRequest = {
      usuarioAccion: this.obtenerUsuarioActual(),
      IdSaldoCuenta: this.filtros.IdSaldoCuenta || undefined,
      IdPersona: this.filtros.IdPersona || undefined,
      Nombre: this.filtros.Nombre.trim() || undefined,
      Apellido: this.filtros.Apellido.trim() || undefined,
      Desde: this.filtros.Desde || undefined,
      Hasta: this.filtros.Hasta || undefined
    };

    this.estadoCuentaService.exportarCsv(request).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        const fecha = new Date().toISOString().split('T')[0];
        link.download = `EstadoCuenta_${fecha}.csv`;

        link.click();
        window.URL.revokeObjectURL(url);

        this.mostrarMensaje('Archivo CSV descargado correctamente', 'success');
        this.loading = false;
      },
      error: (error) => {
        this.mostrarMensaje('Error al exportar el estado de cuenta', 'error');
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  /**
   * Imprime el estado de cuenta
   */
  imprimir(): void {
    if (!this.mostrarResultados || !this.header) {
      this.mostrarMensaje('Debe realizar una búsqueda antes de imprimir', 'error');
      return;
    }

    // Guardar estado antes de navegar
    this.guardarEstadoActual();

    // Preparar los datos para la vista de impresión (mantener sessionStorage como respaldo)
    const datosParaImprimir = {
      header: this.header,
      items: this.items,
      totales: this.totales,
      filtros: this.filtros
    };

    // Guardar en sessionStorage para la vista de impresión
    sessionStorage.setItem('estadoCuentaParaImprimir', JSON.stringify(datosParaImprimir));

    // Navegar a la vista de impresión
    this.router.navigate(['/app/estado-cuentas/detalle']);
  }

  /**
   * Formatea un valor decimal a moneda
   */
  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(valor);
  }

  /**
   * Formatea una fecha ISO a formato legible
   */
  formatearFechaLegible(fecha: string | null): string {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return new Intl.DateTimeFormat('es-GT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  /**
   * Muestra un mensaje al usuario
   */
  private mostrarMensaje(texto: string, tipo: 'success' | 'error' | 'info'): void {
    this.mensaje = texto;
    this.tipoMensaje = tipo;

    // Auto-ocultar mensajes de éxito después de 5 segundos
    if (tipo === 'success') {
      setTimeout(() => {
        this.mensaje = '';
      }, 5000);
    }
  }

  /**
   * Obtiene el usuario actual desde localStorage
   */
  private obtenerUsuarioActual(): string {
    const sessionStr = localStorage.getItem('currentUser');
    if (sessionStr) {
      try {
        const sessionObj = JSON.parse(sessionStr);
        return sessionObj.IdUsuario || 'Desconocido';
      } catch {
        return 'Desconocido';
      }
    }
    return 'Desconocido';
  }
}
