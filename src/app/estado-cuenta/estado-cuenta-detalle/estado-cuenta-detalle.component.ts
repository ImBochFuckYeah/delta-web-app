import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  EstadoCuentaHeader,
  EstadoCuentaItem,
  EstadoCuentaTotales
} from '../../services/estado-cuenta.service';

interface DatosImprimir {
  header: EstadoCuentaHeader;
  items: EstadoCuentaItem[];
  totales: EstadoCuentaTotales;
  filtros: any;
}

@Component({
  selector: 'app-estado-cuenta-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estado-cuenta-detalle.component.html',
  styleUrl: './estado-cuenta-detalle.component.scss'
})
export class EstadoCuentaDetalleComponent implements OnInit {
  header: EstadoCuentaHeader | null = null;
  items: EstadoCuentaItem[] = [];
  totales: EstadoCuentaTotales | null = null;
  fechaImpresion: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Obtener datos desde sessionStorage
    const datosStr = sessionStorage.getItem('estadoCuentaParaImprimir');

    if (!datosStr) {
      // Si no hay datos, redirigir a la vista de consulta
      alert('No hay datos para imprimir. Por favor, realice una búsqueda primero.');
      this.router.navigate(['/app/estado-cuentas/consulta']);
      return;
    }

    try {
      const datos: DatosImprimir = JSON.parse(datosStr);
      this.header = datos.header;
      this.items = datos.items;
      this.totales = datos.totales;

      // Establecer fecha de impresión
      this.fechaImpresion = new Date().toLocaleString('es-GT', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error al cargar datos para imprimir:', error);
      alert('Error al cargar los datos. Por favor, intente nuevamente.');
      this.router.navigate(['/app/estado-cuenta/consulta']);
    }
  }

  /**
   * Imprime el documento
   */
  imprimir(): void {
    window.print();
  }

  /**
   * Vuelve a la vista de consulta
   */
  volver(): void {
    window.history.back();
  }

  /**
   * Formatea un valor decimal a moneda
   */
  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
      minimumFractionDigits: 2
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
   * Formatea fecha solo con día
   */
  formatearFechaCorta(fecha: string | null): string {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return new Intl.DateTimeFormat('es-GT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  }
}
