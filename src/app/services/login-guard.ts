import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      // Si ya está logueado, lo mandamos al menú
      this.router.navigate(['/app']);
      return false;
    } else {
      // Si no está logueado, puede acceder al login
      return true;
    }
  }
}
