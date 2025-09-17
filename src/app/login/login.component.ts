import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService, LoginRequest, LoginDatos, ApiResponse } from '../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario = '';
  password = '';
  mensaje = '';
  cargando = false;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  onLogin() {
    this.cargando = true;
    this.mensaje = '';

    const req: LoginRequest = {
      Usuario: this.usuario,
      Password: this.password
    };

    this.loginService.login(req).subscribe({
      next: (resp: any) => {
        if (resp.Exito) {
          this.mensaje = `✅ Bienvenido ${resp.Datos?.IdUsuario}`;

          // Guardar datos de sesión
          localStorage.setItem('currentUser', JSON.stringify(resp.Datos));
          localStorage.setItem('token', resp.Datos.Sesion);

          setTimeout(() => {
            this.router.navigate(['/app']); // Redirigir al menú principal
          }, 1500);
        } else {
          this.mensaje = `❌ ${resp.Mensaje}`;
        }
        this.cargando = false;
      },
      error: (error: any) => {
        console.error('Error en login:', error);
        this.mensaje = '⚠️ Error de conexión con el servidor';
        this.cargando = false;
      }
    });
  }
}
