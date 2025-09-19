import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { SucursalService, SucursalRequest } from '../../services/sucursal.service';
import { EmpresaService, EmpresaObj } from '../../services/empresa.service';

@Component({
  selector: 'app-sucursal-form.component',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sucursal-form.component.html',
  styleUrl: './sucursal-form.component.scss'
})
export class SucursalFormComponent implements OnInit {
  sucursal: SucursalRequest = {
    Nombre: '',
    Direccion: '',
    IdEmpresa: undefined,
    Usuario: ''
  };
  empresas: EmpresaObj[] = [];
  loading = false;
  error = '';
  success = '';
  editMode = false;
  sucursalId: number = 0;

  constructor(
    private sucursalService: SucursalService,
    private empresaService: EmpresaService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.empresaService.listarSinParametros().subscribe({
      next: (resp) => {
        this.empresas = resp.data || [];
      }
    });

    this.sucursalId = Number(this.route.snapshot.paramMap.get('id')) || 0;
    this.editMode = this.sucursalId > 0;
    if (this.editMode) {
      this.loading = true;
      this.sucursalService.listar({ IdSucursal: this.sucursalId, Page: 1, PageSize: 1, Usuario: '' }).subscribe({
        next: (resp) => {
          if (resp.ok && resp.data && resp.data.length > 0) {
            this.sucursal = resp.data[0];
          } else {
            this.error = resp.error || 'No se pudo cargar la sucursal';
          }
          this.loading = false;
        },
        error: () => {
          this.error = 'Error al cargar la sucursal';
          this.loading = false;
        }
      });
    }
  }

  onSubmit(): void {
    this.error = '';
    this.success = '';
    this.loading = true;

    if (this.editMode) {
      this.sucursalService.editar(this.sucursal).subscribe({
        next: (resp) => {
          if (resp.ok) {
            this.success = 'Sucursal actualizada correctamente';
            setTimeout(() => this.router.navigate(['/app/sucursales']), 1200);
          } else {
            this.error = resp.error || 'Error al actualizar sucursal';
          }
          this.loading = false;
        },
        error: () => {
          this.error = 'Error al actualizar sucursal';
          this.loading = false;
        }
      });
    } else {
      this.sucursalService.crear(this.sucursal).subscribe({
        next: (resp) => {
          if (resp.ok) {
            this.success = 'Sucursal creada correctamente';
            setTimeout(() => this.router.navigate(['/app/sucursales']), 1200);
          } else {
            this.error = resp.error || 'Error al crear sucursal';
          }
          this.loading = false;
        },
        error: () => {
          this.error = 'Error al crear sucursal';
          this.loading = false;
        }
      });
    }
  }
}
