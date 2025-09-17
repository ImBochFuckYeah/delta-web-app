import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesService } from '../services/roles.service';

@Component({
  selector: 'app-roles-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles-form.component.html',
  styleUrls: ['./roles-form.component.css']
})
export class RolesFormComponent implements OnInit {
  isEdit = false;
  loading = false;
  roleId: number = 0;

  formData: any = {
    Nombre: '',
    UsuarioAccion: 'admin'
  };

  constructor(
    private rolesService: RolesService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.roleId = Number(this.route.snapshot.paramMap.get('id')) || 0;
    this.isEdit = this.roleId > 0;

    if (this.isEdit) {
      this.cargarRole();
    }
  }

  cargarRole(): void {
    this.loading = true;
    this.rolesService.obtener(this.roleId).subscribe({
      next: (response) => {
        if (response.Exito && response.Datos) {
          this.formData = {
            ...this.formData,
            ...response.Datos
          };
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar rol:', error);
        this.loading = false;
        alert('Error al cargar rol');
      }
    });
  }

  onSubmit(): void {
    if (!this.formData.Nombre) {
      alert('El nombre del rol es requerido');
      return;
    }

    this.loading = true;

    if (this.isEdit) {
      this.rolesService.actualizar(
        this.roleId,
        this.formData.Nombre,
        this.formData.UsuarioAccion
      ).subscribe({
        next: (response) => {
          this.handleResponse(response);
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    } else {
      this.rolesService.crear(
        this.formData.Nombre,
        this.formData.UsuarioAccion
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
    this.router.navigate(['/roles']);
  }

  private handleResponse(response: any): void {
    this.loading = false;
    const exito = response.ok || response.Exito || response.Resultado === 1;
    const mensaje = response.Mensaje || 'Operación completada';

    if (exito) {
      alert('Operación realizada con éxito');
      this.router.navigate(['/roles']);
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
