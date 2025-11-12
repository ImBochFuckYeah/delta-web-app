import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CierreMesService, PeriodoPendiente, DetalleCierre } from '../../services/cierre-mes.service';

@Component({
  selector: 'app-cierre-mes-proceso',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cierre-mes-proceso.component.html',
  styleUrl: './cierre-mes-proceso.component.scss'
})
export class CierreMesProcesComponent implements OnInit {
  periodosPendientes: PeriodoPendiente[] = [];
  periodoSeleccionado: PeriodoPendiente | null = null;
  loading = false;
  loadingProceso = false;
  error = '';
  success = '';
  detalleResultado: DetalleCierre | null = null;
  mostrarConfirmacion = false;

  private usuario = '';

  constructor(private cierreMesService: CierreMesService) { }

  ngOnInit(): void {
    // Obtener usuario de la sesión
    const sessionStr = localStorage.getItem('currentUser');
    if (sessionStr) {
      try {
        const sessionObj = JSON.parse(sessionStr);
        this.usuario = sessionObj.IdUsuario || 'Desconocido';
      } catch {
        this.usuario = 'Desconocido';
      }
    }

    this.cargarPeriodosPendientes();
  }

  cargarPeriodosPendientes(): void {
    this.loading = true;
    this.error = '';
    this.cierreMesService.obtenerPendientes(this.usuario).subscribe({
      next: (response) => {
        if (response.Resultado === 1) {
          this.periodosPendientes = response.Items || [];
          if (this.periodosPendientes.length === 0) {
            this.error = 'No hay períodos pendientes de cierre.';
          }
        } else {
          this.error = response.Mensaje || 'Error al cargar períodos pendientes';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error de conexión al cargar períodos pendientes';
        console.error('Error:', err);
        this.loading = false;
      }
    });
  }

  seleccionarPeriodo(periodo: PeriodoPendiente): void {
    this.periodoSeleccionado = periodo;
    this.error = '';
    this.success = '';
    this.detalleResultado = null;
  }

  abrirConfirmacion(): void {
    if (!this.periodoSeleccionado) {
      this.error = 'Debe seleccionar un período para cerrar';
      return;
    }
    this.mostrarConfirmacion = true;
  }

  cerrarConfirmacion(): void {
    this.mostrarConfirmacion = false;
  }

  ejecutarCierre(): void {
    if (!this.periodoSeleccionado) return;

    this.loadingProceso = true;
    this.error = '';
    this.success = '';
    this.detalleResultado = null;
    this.mostrarConfirmacion = false;

    this.cierreMesService.ejecutarCierre(
      this.usuario,
      this.periodoSeleccionado.Anio,
      this.periodoSeleccionado.Mes
    ).subscribe({
      next: (response) => {
        if (response.Resultado === 1) {
          this.success = response.Mensaje || 'Cierre de mes ejecutado correctamente';
          this.detalleResultado = response.Data || null;

          // Recargar los períodos pendientes después del cierre exitoso
          setTimeout(() => {
            this.periodoSeleccionado = null;
            this.cargarPeriodosPendientes();
          }, 2000);
        } else {
          this.error = response.Mensaje || 'Error al ejecutar el cierre de mes';
        }
        this.loadingProceso = false;
      },
      error: (err) => {
        this.error = 'Error de conexión al ejecutar el cierre';
        console.error('Error:', err);
        this.loadingProceso = false;
      }
    });
  }

  getNombreMes(mes: number): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[mes - 1] || '';
  }

  reiniciar(): void {
    this.periodoSeleccionado = null;
    this.error = '';
    this.success = '';
    this.detalleResultado = null;
    this.cargarPeriodosPendientes();
  }
}
