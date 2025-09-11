import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword {
  email = '';
  mensaje = '';
  cargando = false;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  onSubmit() {
    if (!this.email) {
      this.mensaje = '⚠️ Debes ingresar un correo válido';
      return;
    }

    this.cargando = true;
    this.mensaje = '';

    this.usuarioService.obtenerUsuario(this.email).subscribe({
      next: (res) => {
        this.cargando = false;
        if (res && res.Resultado === 1 && res.Data?.IdUsuario) {
          this.mensaje = '✅ Correo válido, redirigiendo...';

          setTimeout(() => {
            this.router.navigate(['/reset-password', res.Data!.IdUsuario]);
          }, 1200);
        } else {
          this.mensaje = `❌ ${res?.Mensaje || 'El correo no existe'}`;
        }
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error en forgot-password:', err);
        this.mensaje = '⚠️ Error de conexión con el servidor';
      }
    });
  }
}
