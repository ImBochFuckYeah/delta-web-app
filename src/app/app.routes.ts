import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsuarioFormComponent } from './usuario/usuario-form.component';
import { UsuarioListComponent } from './usuario/usuario-list.component';
import { MenuComponent } from './menu/menu.component';
import { RolesListComponent } from './Roles/roles-list.component';
import { RolesFormComponent } from './Roles/roles-form.component';
import { GenerosListComponent } from './Genero/generos-list.component';
import { GenerosFormComponent } from './Genero/generos-form.component';
import { AuthGuard } from './services/auth.guard';
import { LoginGuard } from './services/login-guard';
import { Forbidden } from './errors/forbidden/forbidden';
import { ForgotPassword } from './forgot-password/forgot-password';
import { ResetPassword } from './reset-password/reset-password';
import { StatusUsuariosListComponent } from './usuario/status-usuarios-list.component';
//import { StatusUsuariosFormComponent } from '.usuario/status-usuarios-form.component';
import { StatusUsuariosFormComponent } from './usuario/status-usuarios-form.component';
export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'forbidden', component: Forbidden },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password/:usuario', component: ResetPassword },
  {
    path: 'app',
    component: MenuComponent,
    canActivate: [AuthGuard], // Solo necesario aquí, se aplica a todas las rutas hijas
    children: [
      { path: 'usuarios', component: UsuarioListComponent },
      { path: 'usuarios/crear', component: UsuarioFormComponent },
      { path: 'usuarios/editar/:id', component: UsuarioFormComponent },

      { path: 'roles', component: RolesListComponent },
      { path: 'roles/crear', component: RolesFormComponent },
      { path: 'roles/editar/:id', component: RolesFormComponent },

      { path: 'generos', component: GenerosListComponent },
      { path: 'generos/crear', component: GenerosFormComponent },
      { path: 'generos/editar/:id', component: GenerosFormComponent },

        { path: 'status-usuarios', component: StatusUsuariosListComponent },
      { path: 'status-usuarios/crear', component: StatusUsuariosFormComponent },
      { path: 'status-usuarios/editar/:id', component: StatusUsuariosFormComponent },

      { path: '', redirectTo: 'usuarios', pathMatch: 'full' } // Solo una redirección
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/forbidden' }
];
