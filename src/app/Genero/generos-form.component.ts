import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GenerosService } from '../services/genero.service';

@Component({
  selector: 'app-generos-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './generos-form.component.html',
  styleUrls: ['./generos-form.component.css']
})
export class GenerosFormComponent implements OnInit {
  isEdit = false;
  loading = false;
  generoId: number = 0;

  formData: any = {
    Nombre: '',
    UsuarioAccion: 'admin'
  };

  constructor(
    private generosService: GenerosService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.generoId = Number(this.route.snapshot.paramMap.get('id')) || 0;
    this.isEdit = this.generoId > 0;

    if (this.isEdit) {
      this.cargarGenero();
    }
  }

  cargarGenero(): void {
    this.loading = true;
    this.generosService.obtener(this.generoId).subscribe({
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
        console.error('Error al cargar género:', error);
        this.loading = false;
        alert('Error al cargar género');
      }
    });
  }

  onSubmit(): void {
    if (!this.formData.Nombre) {
      alert('El nombre del género es requerido');
      return;
    }

    this.loading = true;

    if (this.isEdit) {
      this.generosService.actualizar(
        this.generoId,
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
      this.generosService.crear(
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
    this.router.navigate(['/app/generos']);
  }

  private handleResponse(response: any): void {
    this.loading = false;
    const exito = response.ok || response.Exito || response.Resultado === 1;
    const mensaje = response.mensaje || response.Mensaje || 'Operación completada';

    if (exito) {
      alert('Operación realizada con éxito');
      this.router.navigate(['/app/generos']);
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
