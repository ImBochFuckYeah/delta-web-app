import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword {
  usuario = '';
  pregunta = '';
  respuesta = '';
  password = '';
  confirmPassword = '';
  mensaje = '';
  cargando = false;

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.usuario = this.route.snapshot.paramMap.get('usuario') || '';

    if (this.usuario) {
      this.cargando = true;
      this.usuarioService.obtenerPregunta(this.usuario).subscribe({
        next: (res) => {
          this.cargando = false;
          if (res.Exito === 1) {
            this.pregunta = res.Pregunta || 'Pregunta de seguridad';
          } else {
            this.mensaje = `❌ ${res.Mensaje}`;
          }
        },
        error: (err) => {
          this.cargando = false;
          console.error('Error al obtener pregunta:', err);
          this.mensaje = '⚠️ Error de conexión con el servidor';
        }
      });
    }
  }

  onSubmit() {
    if (!this.respuesta || !this.password || !this.confirmPassword) {
      this.mensaje = '⚠️ Todos los campos son obligatorios';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.mensaje = '❌ Las contraseñas no coinciden';
      return;
    }

    this.cargando = true;
    this.mensaje = '';

    this.usuarioService.validarYActualizar(this.usuario, this.respuesta, this.password).subscribe({
      next: (res) => {
        this.cargando = false;
        if (res.Exito === 1) {
          this.mensaje = '✅ Contraseña actualizada correctamente. Redirigiendo...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        } else {
          this.mensaje = `❌ ${res.Mensaje}`;
        }
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error al actualizar contraseña:', err);
        this.mensaje = '⚠️ Error de conexión con el servidor';
      }
    });
  }
}
