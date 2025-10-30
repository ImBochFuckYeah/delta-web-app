import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StatusUsuariosService } from '../services/status-usuario.service';

@Component({
  selector: 'app-status-usuarios-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './status-usuarios-form.component.html',
  styleUrls: ['./status-usuarios-form.component.css']
})
export class StatusUsuariosFormComponent implements OnInit {
  isEdit = false;
  loading = false;
  statusUsuarioId: number = 0;

  formData: any = {
    Nombre: '',
    UsuarioAccion: 'admin'
  };

  constructor(
    private statusUsuariosService: StatusUsuariosService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.statusUsuarioId = Number(this.route.snapshot.paramMap.get('id')) || 0;
    this.isEdit = this.statusUsuarioId > 0;

    if (this.isEdit) {
      this.cargarStatusUsuario();
    }
  }

  cargarStatusUsuario(): void {
    this.loading = true;
    this.statusUsuariosService.obtener(this.statusUsuarioId).subscribe({
      next: (response) => {
        if (response.ok && response.data && response.data.length > 0) {
          this.formData = {
            ...this.formData,
            ...response.data[0]
          };
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar status usuario:', error);
        this.loading = false;
        alert('Error al cargar status usuario');
      }
    });
  }

  onSubmit(): void {
    if (!this.formData.Nombre) {
      alert('El nombre del status usuario es requerido');
      return;
    }

    this.loading = true;

    if (this.isEdit) {
      this.statusUsuariosService.actualizar(
        this.statusUsuarioId,
        this.formData.Nombre,
      ).subscribe({
        next: (response) => {
          this.handleResponse(response);
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    } else {
      this.statusUsuariosService.crear(
        this.formData.Nombre,
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
    this.router.navigate(['/app/status-usuarios']);
  }

  private handleResponse(response: any): void {
    this.loading = false;
    const exito = response.ok || response.Exito || response.Resultado === 1;
    const mensaje = response.Mensaje || 'Operación completada';

    if (exito) {
      alert('Operación realizada con éxito');
      this.router.navigate(['/app/status-usuarios']);
    } else {
      alert('Error: ' + mensaje);
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
