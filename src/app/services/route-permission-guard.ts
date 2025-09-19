import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RoutePermissionGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let ruta = state.url.replace(/^\/app\/?/, '');
    ruta = ruta.split('/')[0];
    // console.log('ruta: ', ruta);
    if (this.authService.isRouteAllowed(ruta)) {
      return true;
    } else {
      this.router.navigate(['/forbidden']);
      return false;
    }
  }
}