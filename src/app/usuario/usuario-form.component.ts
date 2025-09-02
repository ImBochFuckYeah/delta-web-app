import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService, UsuarioCrearRequest, UsuarioActualizarRequest, UsuarioDto } from '../services/usuario.service';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {
  isEdit = false;
  loading = false;
  usuarioId: string = '';

  formData: any = {
    IdUsuario: '',
    Nombre: '',
    Apellido: '',
    FechaNacimiento: '',
    IdStatusUsuario: 1,
    Password: '',
    IdGenero: '',
    CorreoElectronico: '',
    TelefonoMovil: '',
    IdSucursal: '',
    Pregunta: '',
    Respuesta: '',
    IdRole: '',
    FotografiaBase64: ''
  };

  constructor(
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.usuarioId = this.route.snapshot.paramMap.get('id') || '';
    this.isEdit = !!this.usuarioId;

    if (this.isEdit) {
      this.cargarUsuario();
    }
  }

  cargarUsuario(): void {
    this.loading = true;
    this.usuarioService.obtener(this.usuarioId).subscribe({
      next: (response) => {
        if (response.Exito && response.Datos) {
          this.formData = { ...response.Datos };
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuario:', error);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.loading = true;

    if (this.isEdit) {
      const request: UsuarioActualizarRequest = this.formData;
      this.usuarioService.actualizar(request).subscribe({
        next: (response) => {
          this.handleResponse(response);
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    } else {
      const request: UsuarioCrearRequest = this.formData;
      this.usuarioService.crear(request).subscribe({
        next: (response) => {
          this.handleResponse(response);
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    }
  }

  private handleResponse(response: any): void {
    this.loading = false;
    if (response.Exito) {
      alert('Operación realizada con éxito');
      this.router.navigate(['/usuarios']);
    } else {
      alert('Error: ' + response.Mensaje);
    }
  }

  private handleError(error: any): void {
    this.loading = false;
    console.error('Error:', error);
    alert('Error en la operación');
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.formData.FotografiaBase64 = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
