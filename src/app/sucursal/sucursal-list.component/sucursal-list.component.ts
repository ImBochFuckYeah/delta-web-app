import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SucursalRequest, SucursalService } from '../../services/sucursal.service';
import { EmpresaService, EmpresaObj } from '../../services/empresa.service';
import { EmpresaNamePipe } from '../../pipes/empresa-name.pipe';

@Component({
  selector: 'app-sucursal-list.component',
  imports: [CommonModule, FormsModule, RouterLink, EmpresaNamePipe],
  templateUrl: './sucursal-list.component.html',
  styleUrl: './sucursal-list.component.scss'
})
export class SucursalListComponent {
  sucursales: SucursalRequest[] = [];
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  searchTerm = '';
  loading = false;
  empresas: EmpresaObj[] = [];

  constructor(
    private sucursalService: SucursalService,
    private empresaService: EmpresaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.empresaService.listarSinParametros().subscribe({
      next: (resp) => {
        this.empresas = resp.data || [];
      }
    });
    this.cargarSucursales();
  }

  cargarSucursales(): void {
    this.loading = true;
    this.sucursalService.listar({
      Page: this.currentPage,
      PageSize: this.pageSize,
      BuscarNombre: this.searchTerm,
      Usuario: '' // El servicio lo obtiene automáticamente
    }).subscribe({
      next: (resp) => {
        if (resp.ok && resp.data) {
          this.sucursales = resp.data;
          this.totalItems = resp.data.length;
        } else {
          this.sucursales = [];
          this.totalItems = 0;
        }
        this.loading = false;
      },
      error: () => {
        this.sucursales = [];
        this.totalItems = 0;
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.cargarSucursales();
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.cargarSucursales();
  }

  editarSucursal(idSucursal: number): void {
    this.router.navigate(['/app/sucursales/editar', idSucursal]);
  }

  eliminarSucursal(idSucursal: number): void {
    if (confirm('¿Está seguro de eliminar esta sucursal?')) {
      this.loading = true;
      this.sucursalService.eliminar({ IdSucursal: idSucursal, Usuario: '' }).subscribe({
        next: (resp) => {
          if (resp.ok) {
            this.cargarSucursales();
          } else {
            alert('Error: ' + resp.error);
          }
        },
        error: () => {
          this.loading = false;
          alert('Error al eliminar empresa');
        }
      });
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize) || 1;
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
