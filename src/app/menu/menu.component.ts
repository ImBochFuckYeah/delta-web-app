import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  menuItems = [
    { path: '/app/usuarios', label: 'Gestión de Usuarios', icon: 'bi-people' },
    { path: '/app/roles', label: 'Gestion de Roles', icon: 'bi-people' },
    { path: '/app/empresas', label: 'Gestion de Empresas', icon: 'bi-people' },
    { path: '/app/sucursales', label: 'Gestion de Sucursales', icon: 'bi-people' }
  ];

  currentUser: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
  }
}
