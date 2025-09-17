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
    { path: '/usuarios', label: 'Gestión de Usuarios', icon: 'bi-people' },
    { path: '/roles', label: 'Gestion de Roles', icon: 'bi-people' },
    { path: '/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' }
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
