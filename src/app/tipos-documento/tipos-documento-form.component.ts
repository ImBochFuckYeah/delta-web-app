import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoDocumentoService } from '../services/tipo-documento.service';

@Component({
  selector: 'app-tipos-documento-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tipos-documento-form.component.html',
  styleUrls: ['./tipos-documento-form.component.css']
})
export class TiposDocumentoFormComponent implements OnInit {
  isEdit = false;
  loading = false;
  tipoDocumentoId: number = 0;

  formData: any = {
    Nombre: ''
  };

  constructor(
    private tipoDocumentoService: TipoDocumentoService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.tipoDocumentoId = Number(this.route.snapshot.paramMap.get('id')) || 0;
    this.isEdit = this.tipoDocumentoId > 0;

    if (this.isEdit) {
      this.cargarTipoDocumento();
    }
  }

  cargarTipoDocumento(): void {
    this.loading = true;
    this.tipoDocumentoService.listar(this.tipoDocumentoId).subscribe({
      next: (response) => {
        if (response.Resultado === 1 && response.Data) {
          this.formData = {
            Nombre: response.Data.Nombre
          };
        } else {
          alert('Error: ' + response.Mensaje);
          this.router.navigate(['/app/tipos-documento']);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar tipo de documento:', error);
        this.loading = false;
        alert('Error al cargar tipo de documento');
        this.router.navigate(['/app/tipos-documento']);
      }
    });
  }

  onSubmit(): void {
    if (!this.formData.Nombre || !this.formData.Nombre.trim()) {
      alert('El nombre del tipo de documento es requerido');
      return;
    }

    this.loading = true;

    if (this.isEdit) {
      this.tipoDocumentoService.actualizar(
        this.tipoDocumentoId,
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
      this.tipoDocumentoService.crear(
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
    this.router.navigate(['/app/tipos-documento']);
  }

  private handleResponse(response: any): void {
    this.loading = false;
    if (response.Resultado === 1) {
      alert('Operación realizada con éxito');
      this.router.navigate(['/app/tipos-documento']);
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
