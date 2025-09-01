import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService, LoginRequest, LoginDatos } from '../services/login.service';

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
      usuario: this.usuario,
      password: this.password
    };

    this.loginService.login(req).subscribe({
      next: (resp: any) => {
        if (resp.exito) {
          this.mensaje = `✅ Bienvenido ${resp.datos?.nombre} ${resp.datos?.apellido}`;

          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        } else {
          this.mensaje = `❌ ${resp.mensaje}`;
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
