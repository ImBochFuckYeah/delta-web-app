import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Modulo, Menu, Opcion } from '../modelos/menu.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {
    const rutas = localStorage.getItem('allowedRoutes');
    if (rutas) {
      this.allowedRoutes = JSON.parse(rutas);
      this.allowedRoutesSet = true;
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('allowedRoutes'); // Limpia persistencia
    this.allowedRoutesSet = false;
    this.allowedRoutes = [];
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private allowedRoutes: string[] = [];
  private allowedRoutesSet = false;

  setAllowedRoutesFromMenu(menu: Modulo[]) {
    if (this.allowedRoutesSet) return; // Solo setea una vez
    const rutas: string[] = [];
    menu.forEach(modulo => {
      modulo.menus.forEach(menuItem => {
        menuItem.opciones.forEach(opcion => {
          // Solo la ruta principal
          rutas.push(opcion.pagina);
        });
      });
    });
    this.allowedRoutes = rutas;
    localStorage.setItem('allowedRoutes', JSON.stringify(rutas)); // Persistencia
    this.allowedRoutesSet = true;
  }

  isRouteAllowed(ruta: string): boolean {
    // console.log('ruta_param:', ruta, '. allowed_routes:', this.allowedRoutes)
    return this.allowedRoutes.includes(ruta);
  }
}
