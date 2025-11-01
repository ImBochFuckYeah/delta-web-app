import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StatusCuentaService } from '../services/status-cuenta.service';

@Component({
  selector: 'app-status-cuenta-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './status-cuenta-form.component.html',
  styleUrls: ['./status-cuenta-form.component.css']
})
export class StatusCuentaFormComponent implements OnInit {
  isEdit = false;
  loading = false;
  statusCuentaId: number = 0;

  formData: any = {
    Nombre: ''
  };

  constructor(
    private statusCuentaService: StatusCuentaService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.statusCuentaId = Number(this.route.snapshot.paramMap.get('id')) || 0;
    this.isEdit = this.statusCuentaId > 0;

    if (this.isEdit) {
      this.cargarStatusCuenta();
    }
  }

  cargarStatusCuenta(): void {
    this.loading = true;
    this.statusCuentaService.listar(this.statusCuentaId).subscribe({
      next: (response) => {
        if (response.Resultado === 1 && response.Data) {
          this.formData = {
            Nombre: response.Data.Nombre
          };
        } else {
          alert('Error: ' + response.Mensaje);
          this.router.navigate(['/app/status-cuenta']);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar status de cuenta:', error);
        this.loading = false;
        alert('Error al cargar status de cuenta');
        this.router.navigate(['/app/status-cuenta']);
      }
    });
  }

  onSubmit(): void {
    if (!this.formData.Nombre || !this.formData.Nombre.trim()) {
      alert('El nombre del status de cuenta es requerido');
      return;
    }

    this.loading = true;

    if (this.isEdit) {
      this.statusCuentaService.actualizar(
        this.statusCuentaId,
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
      this.statusCuentaService.crear(
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
    this.router.navigate(['/app/status-cuenta']);
  }

  private handleResponse(response: any): void {
    this.loading = false;
    if (response.Resultado === 1) {
      alert('Operación realizada con éxito');
      this.router.navigate(['/app/status-cuenta']);
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
