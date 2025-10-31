import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { UsuarioFormComponent } from './usuario/usuario-form.component';
import { UsuarioListComponent } from './usuario/usuario-list.component';
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
import { NotFound } from './errors/not-found/not-found';
import { WelcomePage } from './welcome-page/welcome-page';
import { RoutePermissionGuard } from './services/route-permission-guard';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ModuloListComponent } from './modulo/modulo-list/modulo-list.component';
import { ModuloFormComponent } from './modulo/modulo-form/modulo-form.component';
import { MenuListComponent } from './menu/menu-list.component/menu-list.component';
import { MenuFormComponent } from './menu/menu-form.component/menu-form.component';
import { OpcionesListComponent } from './opciones/opciones-list.component/opciones-list.component';
import { OpcionesFormComponent } from './opciones/opciones-form.component/opciones-form.component';
import { PersonaListComponent } from './persona/persona-list.component';
import { PersonaFormComponent } from './persona/persona-form.component';
import { CuentaListComponent } from './cuentas/cuenta-list.component';
import { CuentaFormComponent } from './cuentas/cuenta-form.component';
import { SaldoConsultaComponent } from './cuentas/saldo-consulta.component';
import { EstadoCivilListComponent } from './estado-civil/estado-civil-list';
import { EstadoCivilComponent } from './estado-civil/estado-civil';
import { TiposMovCCListComponent } from './tipos-movimiento-cxc-list/tipos-movimiento-cxc-list';
import { TiposMovCCFormComponent } from './tipos-movimiento-cxc-list/tipos-movimiento-cxc-form';
import { TiposCuentaComponent } from './tipos-cuenta/tipos-cuenta.component';
import { TiposDocumentoComponent } from './tipos-documento/tipos-documento.component';
import { StatusCuentaComponent } from './status-cuenta/status-cuenta.component';




export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'forbidden', component: Forbidden },
  { path: 'not-found', component: NotFound },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password/:usuario', component: ResetPassword },
  {
    path: 'app',
    component: SidebarComponent,
    canActivate: [AuthGuard], // Solo necesario aquí, se aplica a todas las rutas hijas
    children: [
      // usuario
      { path: 'usuarios', component: UsuarioListComponent, canActivate: [AuthGuard, RoutePermissionGuard] },
      { path: 'usuarios/crear', component: UsuarioFormComponent, canActivate: [AuthGuard, RoutePermissionGuard] },
      { path: 'usuarios/editar/:id', component: UsuarioFormComponent, canActivate: [AuthGuard, RoutePermissionGuard] },

      // roles
      { path: 'roles', component: RolesListComponent, canActivate: [AuthGuard, RoutePermissionGuard] },
      //{ path: 'roles/crear', component: RolesFormComponent },
      { path: 'roles/crear', component: RolesCrearComponent, canActivate: [AuthGuard, RoutePermissionGuard] },
      { path: 'roles/editar/:id', component: RolesFormComponent, canActivate: [AuthGuard, RoutePermissionGuard] },
      { path: 'roles/permisos/:id', component: RolePermisosComponent, canActivate: [AuthGuard, RoutePermissionGuard] },

      // empresas
      { path: 'empresas', component: EmpresaListComponent, canActivate: [AuthGuard, RoutePermissionGuard] },
      { path: 'empresas/crear', component: EmpresaFormComponent, canActivate: [AuthGuard, RoutePermissionGuard] },
      { path: 'empresas/editar/:id', component: EmpresaFormComponent, canActivate: [AuthGuard, RoutePermissionGuard] },

      // sucursales
      { path: 'sucursales', component: SucursalListComponent, canActivate: [AuthGuard, RoutePermissionGuard] },
      { path: 'sucursales/crear', component: SucursalFormComponent, canActivate: [AuthGuard, RoutePermissionGuard] },
      { path: 'sucursales/editar/:id', component: SucursalFormComponent, canActivate: [AuthGuard, RoutePermissionGuard] },

      // ruta principal
      { path: '', component: WelcomePage, canActivate: [AuthGuard] },

      // generos
      { path: 'generos', component: GenerosListComponent, canActivate: [AuthGuard, RoutePermissionGuard] },
      { path: 'generos/crear', component: GenerosFormComponent, canActivate: [AuthGuard, RoutePermissionGuard] },
      { path: 'generos/editar/:id', component: GenerosFormComponent, canActivate: [AuthGuard, RoutePermissionGuard] },

      // estatus usuario
      { path: 'status-usuarios', component: StatusUsuariosListComponent, canActivate: [AuthGuard, RoutePermissionGuard] },
      { path: 'status-usuarios/crear', component: StatusUsuariosFormComponent, canActivate: [AuthGuard, RoutePermissionGuard] },
      { path: 'status-usuarios/editar/:id', component: StatusUsuariosFormComponent, canActivate: [AuthGuard, RoutePermissionGuard] },

      // modulos
      { path: 'modulos', component: ModuloListComponent, canActivate: [AuthGuard, RoutePermissionGuard] },
      { path: 'modulos/crear', component: ModuloFormComponent, canActivate: [AuthGuard, RoutePermissionGuard] },
      { path: 'modulos/editar/:id', component: ModuloFormComponent, canActivate: [AuthGuard, RoutePermissionGuard] },

      // menus
      { path: 'menus', component: MenuListComponent, canActivate: [AuthGuard, RoutePermissionGuard] },
      { path: 'menus/crear', component: MenuFormComponent, canActivate: [AuthGuard, RoutePermissionGuard] },
      { path: 'menus/editar/:id', component: MenuFormComponent, canActivate: [AuthGuard, RoutePermissionGuard] },

      // opciones
      { path: 'opciones', component: OpcionesListComponent, canActivate: [AuthGuard, RoutePermissionGuard] },
      { path: 'opciones/crear', component: OpcionesFormComponent, canActivate: [AuthGuard, RoutePermissionGuard] },
      { path: 'opciones/editar/:id', component: OpcionesFormComponent, canActivate: [AuthGuard, RoutePermissionGuard] },


      // Personas
      { path: 'personas', component: PersonaListComponent, canActivate: [AuthGuard, RoutePermissionGuard] },
      { path: 'personas/crear', component: PersonaFormComponent, canActivate: [AuthGuard, RoutePermissionGuard] },
      { path: 'personas/editar/:id', component: PersonaFormComponent, canActivate: [AuthGuard, RoutePermissionGuard] },

      // Cuentas
      { path: 'saldo-cuentas', component: CuentaListComponent, canActivate: [AuthGuard, RoutePermissionGuard] },
      { path: 'saldo-cuentas/crear', component: CuentaFormComponent, canActivate: [AuthGuard, RoutePermissionGuard] },
      { path: 'saldo-cuentas/editar/:id', component: CuentaFormComponent, canActivate: [AuthGuard, RoutePermissionGuard] },
      { path: 'consulta-saldos', component: SaldoConsultaComponent, canActivate: [AuthGuard, RoutePermissionGuard] },

      //estado civil
      { path: 'estado-civil', component: EstadoCivilListComponent, canActivate: [AuthGuard, RoutePermissionGuard] },
      { path: 'estado-civil/crear', component: EstadoCivilComponent, canActivate: [AuthGuard, RoutePermissionGuard] },
      { path: 'estado-civil/editar/:id', component: EstadoCivilComponent, canActivate: [AuthGuard, RoutePermissionGuard] },

      // tipos de movimiento
      { path: 'tipos-movimiento-cxc', component: TiposMovCCListComponent, canActivate: [AuthGuard, RoutePermissionGuard] },
      { path: 'tipos-movimiento-cxc/crear', component: TiposMovCCFormComponent, canActivate: [AuthGuard, RoutePermissionGuard] },
      { path: 'tipos-movimiento-cxc/editar/:id', component: TiposMovCCFormComponent, canActivate: [AuthGuard, RoutePermissionGuard] },

      // tipos de cuenta
      { path: 'tipo-saldo-cuenta', component: TiposCuentaComponent, canActivate: [AuthGuard, RoutePermissionGuard] },

      // tipos de documento
      { path: 'tipos-documento', component: TiposDocumentoComponent, canActivate: [AuthGuard, RoutePermissionGuard] },

      // status de cuenta
      { path: 'status-cuenta', component: StatusCuentaComponent, canActivate: [AuthGuard, RoutePermissionGuard] },


    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/not-found' }
];
