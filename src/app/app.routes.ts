import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsuarioFormComponent } from './usuario/usuario-form.component';
import { UsuarioListComponent } from './usuario/usuario-list.component';
import { MenuComponent } from './menu/menu.component'; // Asegúrate de crear este componente
//import { AuthGuard } from './services/auth.guard.ts'; // Asegúrate de crear este guard
import { AuthGuard } from './services/auth.guard';
import { LoginGuard } from './services/login-guard';
import { Forbidden } from './errors/forbidden/forbidden';
import { ForgotPassword } from './forgot-password/forgot-password';
import { ResetPassword } from './reset-password/reset-password';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'forbidden', component: Forbidden },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password/:usuario', component: ResetPassword },
  {
    path: '',
    component: MenuComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'usuarios', component: UsuarioListComponent, canActivate: [AuthGuard] },
      { path: 'usuarios/crear', component: UsuarioFormComponent, canActivate: [AuthGuard] },
      { path: 'usuarios/editar/:id', component: UsuarioFormComponent, canActivate: [AuthGuard] },
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/forbidden' }
];
