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
import { RolePermisosComponent } from './RoleOpciones/RoleOpciones.component';
import { RolesCrearComponent } from './Roles/roles-crear.component';
import { EmpresaListComponent } from './empresa/empresa-list.component/empresa-list.component';
import { EmpresaFormComponent } from './empresa/empresa-form.component/empresa-form.component';
import { SucursalListComponent } from './sucursal/sucursal-list.component/sucursal-list.component';
import { SucursalFormComponent } from './sucursal/sucursal-form.component/sucursal-form.component';

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
      // usuario
      { path: 'usuarios', component: UsuarioListComponent, canActivate: [AuthGuard] },
      { path: 'usuarios/crear', component: UsuarioFormComponent, canActivate: [AuthGuard] },
      { path: 'usuarios/editar/:id', component: UsuarioFormComponent, canActivate: [AuthGuard] },
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' },

      // roles
      { path: 'roles', component: RolesListComponent },
      //{ path: 'roles/crear', component: RolesFormComponent },
      { path: 'roles/crear', component: RolesCrearComponent },
      { path: 'roles/editar/:id', component: RolesFormComponent },
      { path: 'roles/permisos/:id', component: RolePermisosComponent },

      // empresas
      { path: 'empresas', component: EmpresaListComponent, canActivate: [AuthGuard] },
      { path: 'empresas/crear', component: EmpresaFormComponent, canActivate: [AuthGuard] },
      { path: 'empresas/editar/:id', component: EmpresaFormComponent, canActivate: [AuthGuard] },

      // sucursales
      { path: 'sucursales', component: SucursalListComponent, canActivate: [AuthGuard] },
      { path: 'sucursales/crear', component: SucursalFormComponent, canActivate: [AuthGuard] },
      { path: 'sucursales/editar/:id', component: SucursalFormComponent, canActivate: [AuthGuard] },

      // ruta principal
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' },

      // generos
      { path: 'generos', component: GenerosListComponent },
      { path: 'generos/crear', component: GenerosFormComponent },
      { path: 'generos/editar/:id', component: GenerosFormComponent },

      // estatus usuario
      { path: 'status-usuarios', component: StatusUsuariosListComponent },
      { path: 'status-usuarios/crear', component: StatusUsuariosFormComponent },
      { path: 'status-usuarios/editar/:id', component: StatusUsuariosFormComponent },
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/forbidden' }
];
