import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {  SaldosService, SaldoCuentaObj, ConsultaSaldosRequest} from '../services/saldos.service';

@Component({
  selector: 'app-saldos-consulta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consulta-saldos.component.html',
  styleUrl: './consulta-saldos.component.css',
})
export class ConsultaSaldosComponent implements OnInit {
  saldos: SaldoCuentaObj[] = [];
  loading = false;
  error = '';

  // Filtros de búsqueda
  searchTerm = '';

  // Paginación
  page = 1;
  pageSize = 10;
  total = 0;
  totalPages = 0;
  pages: number[] = [];

  constructor(private saldosService: SaldosService) {}

  ngOnInit(): void {
    this.buscarSaldos();
  }

  buscarSaldos(): void {
    this.error = '';
    this.loading = true;

    const request: ConsultaSaldosRequest = {
      buscar: this.searchTerm || undefined,
      pagina: this.page,
      tamanoPagina: this.pageSize,
    };

    this.saldosService.consultarSaldos(request).subscribe({
      next: (response) => {
        if (response.Resultado === 1) {
          this.saldos = response.Items || [];
          this.total = response.Total || 0;
          this.totalPages = Math.ceil(this.total / this.pageSize);
          this.updatePages();
        } else {
          this.error = response.Mensaje || 'Error al consultar saldos';
          this.saldos = [];
          this.total = 0;
          this.totalPages = 0;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error de conexión al consultar saldos';
        this.saldos = [];
        this.total = 0;
        this.totalPages = 0;
        this.loading = false;
        console.error('Error:', err);
      },
    });
  }

  limpiarBusqueda(): void {
    this.searchTerm = '';
    this.page = 1;
    this.buscarSaldos();
  }

  onPageChange(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages) return;
    this.page = newPage;
    this.buscarSaldos();
  }

  updatePages(): void {
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
  }

  formatoMoneda(valor: number): string {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
    }).format(valor);
  }

  formatoFecha(fecha: string): string {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-GT');
  }
}
