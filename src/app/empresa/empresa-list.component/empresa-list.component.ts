import { Component, OnInit } from '@angular/core';
import { EmpresaService, EmpresaObj, ListarEmpresasRequest } from '../../services/empresa.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-empresa-list.component',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './empresa-list.component.html',
  styleUrl: './empresa-list.component.scss'
})
export class EmpresaListComponent implements OnInit {
  empresas: EmpresaObj[] = [];
  totalItems = 0;
  currentPage = 1;
  pageSize = 10;
  searchTerm = '';
  loading = false;

  constructor(private empresaService: EmpresaService, private router: Router) { }

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  cargarEmpresas(): void {
    this.loading = true;
    const request: ListarEmpresasRequest = {
      page: this.currentPage,
      pageSize: this.pageSize,
      buscarNombre: this.searchTerm
    } 
    this.empresaService.listar(request).subscribe({
      next: (response) => {
        if (response.ok) {
          this.empresas = response.data ?? [];
          this.totalItems = (response.data ?? []).length;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.cargarEmpresas();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.cargarEmpresas();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  editarEmpresa(idEmpresa: number): void {
    this.router.navigate(['/app/empresas/editar', idEmpresa]);
  }

  eliminarEmpresa(idEmpresa: number): void {
    // Obtener usuario de la sesión desde localStorage
    const sessionStr = localStorage.getItem('currentUser');
    let usuario = 'Desconocido';
    if (sessionStr) {
      try {
        const sessionObj = JSON.parse(sessionStr);
        usuario = sessionObj.IdUsuario || 'Desconocido';
      } catch {
        usuario = 'Desconocido';
      }
    }

    if (confirm('¿Está seguro de eliminar esta empresa?')) {
      this.empresaService.eliminar(idEmpresa, usuario).subscribe({
        next: (response) => {
          if (response.ok) {
            alert('Empresa eliminada correctamente');
            this.cargarEmpresas();
          } else {
            alert('Error: ' + response.error);
          }
        },
        error: () => {
          alert('Error al eliminar empresa');
        }
      });
    }
  }
}
