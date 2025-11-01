import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoSaldoCuentaService } from '../services/tipo-saldo-cuenta.service';

@Component({
  selector: 'app-tipos-cuenta-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tipos-cuenta-form.component.html',
  styleUrls: ['./tipos-cuenta-form.component.css']
})
export class TiposCuentaFormComponent implements OnInit {
  isEdit = false;
  loading = false;
  tipoCuentaId: number = 0;

  formData: any = {
    Nombre: ''
  };

  constructor(
    private tipoSaldoCuentaService: TipoSaldoCuentaService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.tipoCuentaId = Number(this.route.snapshot.paramMap.get('id')) || 0;
    this.isEdit = this.tipoCuentaId > 0;

    if (this.isEdit) {
      this.cargarTipoCuenta();
    }
  }

  cargarTipoCuenta(): void {
    this.loading = true;
    this.tipoSaldoCuentaService.listar(this.tipoCuentaId).subscribe({
      next: (response) => {
        if (response.Resultado === 1 && response.Data) {
          this.formData = {
            Nombre: response.Data.Nombre
          };
        } else {
          alert('Error: ' + response.Mensaje);
          this.router.navigate(['/app/tipos-cuenta']);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar tipo de cuenta:', error);
        this.loading = false;
        alert('Error al cargar tipo de cuenta');
        this.router.navigate(['/app/tipos-cuenta']);
      }
    });
  }

  onSubmit(): void {
    if (!this.formData.Nombre || !this.formData.Nombre.trim()) {
      alert('El nombre del tipo de cuenta es requerido');
      return;
    }

    this.loading = true;

    if (this.isEdit) {
      this.tipoSaldoCuentaService.actualizar(
        this.tipoCuentaId,
        this.formData.Nombre
      ).subscribe({
        next: (response) => {
          this.handleResponse(response);
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    } else {
      this.tipoSaldoCuentaService.crear(
        this.formData.Nombre
      ).subscribe({
        next: (response) => {
          this.handleResponse(response);
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/app/tipo-saldo-cuenta']);
  }

  private handleResponse(response: any): void {
    this.loading = false;
    if (response.Resultado === 1) {
      alert('Operación realizada con éxito');
      this.router.navigate(['/app/tipo-saldo-cuenta']);
    } else {
      alert('Error: ' + response.Mensaje);
    }
  }

  private handleError(error: any): void {
    this.loading = false;
    console.error('Error:', error);
    let errorMessage = 'Error en la operación';
    if (error.error?.Mensaje) {
      errorMessage = error.error.Mensaje;
    } else if (error.message) {
      errorMessage = error.message;
    }
    alert(errorMessage);
  }
}
