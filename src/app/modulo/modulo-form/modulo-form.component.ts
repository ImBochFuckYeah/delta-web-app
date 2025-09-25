import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ModuloService, ModuloRequest } from '../../services/modulo.service';

@Component({
  selector: 'app-modulo-form.component',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './modulo-form.component.html',
  styleUrl: './modulo-form.component.scss'
})
export class ModuloFormComponent implements OnInit {
  modulo: ModuloRequest = {
    IdModulo: 0,
    Nombre: '',
    OrdenMenu: undefined,
    usuarioAccion: ''
  };
  loading = false;
  error = '';
  success = '';
  editMode = false;
  moduloId: number = 0;

  constructor(
    private moduloService: ModuloService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.moduloId = Number(this.route.snapshot.paramMap.get('id')) || 0;
    this.editMode = this.moduloId > 0;
    if (this.editMode) {
      this.loading = true;
      this.moduloService.listar({ IdModulo: this.moduloId, Pagina: 1, TamanoPagina: 1, usuarioAccion: '' }).subscribe({
        next: (resp) => {
          console.log('Response from listar:', resp);
          if (resp.Mensaje === 'OK' && resp.Resultado == 1) {
            this.modulo = { ...this.modulo, ...resp.Data };
          } else {
            this.error = resp?.Mensaje || 'No se pudo cargar el módulo';
          }
          this.loading = false;
        },
        error: () => {
          this.error = 'Error al cargar el módulo';
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
      this.moduloService.editar(this.modulo).subscribe({
        next: (resp) => {
          if (resp.Resultado === 1) {
            this.success = 'Módulo actualizado correctamente';
            setTimeout(() => this.router.navigate(['/app/modulos']), 1200);
          } else {
            this.error = resp.Mensaje || 'Error al actualizar módulo';
          }
          this.loading = false;
        },
        error: () => {
          this.error = 'Error al actualizar módulo';
          this.loading = false;
        }
      });
    } else {
      this.moduloService.crear(this.modulo).subscribe({
        next: (resp) => {
          if (resp.Resultado === 1) {
            this.success = 'Módulo creado correctamente';
            setTimeout(() => this.router.navigate(['/app/modulos']), 1200);
          } else {
            this.error = resp.Mensaje || 'Error al crear módulo';
          }
          this.loading = false;
        },
        error: () => {
          this.error = 'Error al crear módulo';
          this.loading = false;
        }
      });
    }
  }
}
