import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleName',
  standalone: true
})
export class RoleNamePipe implements PipeTransform {
  transform(idRole: number, roles: any[]): string {
    if (!idRole || !roles || !roles.length) return 'Sin rol';

    const role = roles.find(r => r.IdRole === idRole);
    return role ? role.Nombre : `Rol ${idRole}`;
  }
}
