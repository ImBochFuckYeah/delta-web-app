import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  TiposMovimientoCxcService,
  TipoMovDto,
  BackendResponse
} from '../services/tipos-movimiento-cxc.service';

@Component({
  selector: 'app-tipos-movimiento-cxc-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './tipos-movimiento-cxc-list.html',
  styleUrls: ['./tipos-movimiento-cxc-list.css']
})
export class TiposMovCCListComponent implements OnInit {
  tipos: TipoMovDto[] = [];
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  searchTerm = '';
  loading = false;

  constructor(private service: TiposMovimientoCxcService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.service
      .listar({
        BuscarNombre: this.searchTerm ?? '',
        Pagina: this.currentPage,
        TamanoPagina: this.pageSize
      })
      .subscribe({
        next: (res: BackendResponse<TipoMovDto>) => {
          if (res?.Mensaje === 'OK' && res?.Resultado === 1) {
            this.tipos = Array.isArray(res.Items) ? res.Items : [];
            this.totalItems = (res as any).TotalItems ?? this.tipos.length;
          } else {
            this.tipos = [];
            this.totalItems = 0;
          }
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          alert('Error al cargar Tipos de Movimientos');
        }
      });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.cargar();
  }

  onPageChange(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.currentPage = p;
    this.cargar();
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar el tipo de movimiento?')) return;
    this.service.eliminar(id).subscribe({
      next: (r) => {
        const ok = r?.Resultado === 1 || r?.ok || r?.Exito;
        if (ok) {
          alert('Eliminado con éxito');
          this.cargar();
        } else {
          alert('Error: ' + (r?.Mensaje || r?.error || ''));
        }
      },
      error: () => alert('Error al eliminar')
    });
  }

  // Helpers para la columna "Operación"
  opText(v: any): string {
    const n = +v;            // fuerza a número si viene "1"/"2"
    if (n === 1) return 'Cargo';
    if (n === 2) return 'Abono';
    return '—';
  }

  opClass(v: any): string {
    const n = +v;
    if (n === 1) return 'bg-danger';
    if (n === 2) return 'bg-success';
    return 'bg-secondary';
  }

  trackById(_: number, it: TipoMovDto) {
    return it.IdTipoMovimientoCXC;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
