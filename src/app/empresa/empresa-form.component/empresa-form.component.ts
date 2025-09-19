import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmpresaObj, EmpresaService } from '../../services/empresa.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-empresa-form.component',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './empresa-form.component.html',
  styleUrl: './empresa-form.component.scss'
})
export class EmpresaFormComponent implements OnInit {
  empresa: EmpresaObj = {
    Nombre: '',
    Direccion: '',
    Nit: '',
    PasswordCantidadCaducidadDias: '',
    PasswordCantidadCaracteresEspeciales: '',
    PasswordCantidadMayusculas: '',
    PasswordCantidadMinusculas: '',
    PasswordCantidadNumeros: '',
    PasswordCantidadPreguntasValidar: '',
    PasswordIntentosAntesDeBloquear: '',
    PasswordLargo: '',
    Usuario: ''
  };
  loading = false;
  error = '';
  success = '';
  editMode = false;
  empresaId: number = 0;

  constructor(
    private empresaService: EmpresaService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.empresaId = Number(this.route.snapshot.paramMap.get('id')) || 0;
    this.editMode = this.empresaId > 0;
    if (this.editMode) {
      this.loading = true;
      this.empresaService.obtener(this.empresaId).subscribe({
        next: (resp) => {
          if (resp.ok && resp.data && resp.data.length > 0) {
            this.empresa = resp.data[0];
          } else {
            this.error = resp.message || 'No se pudo cargar la empresa';
          }
          this.loading = false;
        },
        error: () => {
          this.error = 'Error al cargar la empresa';
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
      this.empresaService.actualizar(this.empresa).subscribe({
        next: (resp) => {
          if (resp.ok) {
            this.success = 'Empresa actualizada correctamente';
            setTimeout(() => this.router.navigate(['/app/empresas']), 1200);
          } else {
            this.error = resp.message || 'Error al actualizar empresa';
          }
          this.loading = false;
        },
        error: () => {
          this.error = 'Error al actualizar empresa';
          this.loading = false;
        }
      });
    } else {
      this.empresaService.crear(this.empresa).subscribe({
        next: (resp) => {
          if (resp.ok) {
            this.success = 'Empresa creada correctamente';
            setTimeout(() => this.router.navigate(['/app/empresas']), 1200);
          } else {
            this.error = resp.message || 'Error al crear empresa';
          }
          this.loading = false;
        },
        error: () => {
          this.error = 'Error al crear empresa';
          this.loading = false;
        }
      });
    }
  }
}
