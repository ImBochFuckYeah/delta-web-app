import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Modulo } from '../modelos/menu.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sidebar.component',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  modulos: Modulo[] = [];
  currentUser: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.loadMenu();
  }

  loadMenu() {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.NavegacionJson) {
        let modulos = JSON.parse(user.NavegacionJson);
        // Si es array de arrays, aplánalo
        if (Array.isArray(modulos) && Array.isArray(modulos[0])) {
          modulos = modulos[0];
        }
        // Si es objeto, conviértelo en array
        if (!Array.isArray(modulos)) {
          modulos = Object.values(modulos);
        }
        // console.log(modulos);
        this.modulos = modulos[0] ?? [];
        this.authService.setAllowedRoutesFromMenu(this.modulos);
      }
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
