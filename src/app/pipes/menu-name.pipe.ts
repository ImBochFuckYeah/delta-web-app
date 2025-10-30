import { Pipe, PipeTransform } from '@angular/core';
import { MenuObj } from '../services/menu.service';

@Pipe({
  name: 'menuName',
  standalone: true
})
export class MenuNamePipe implements PipeTransform {

  transform(idMenu: number | undefined, menus: MenuObj[]): string {
    if (!idMenu || !menus || menus.length === 0) {
      return 'Sin menú';
    }
    
    const menu = menus.find(m => m.IdMenu === idMenu);
    return menu?.Nombre || 'Menú desconocido';
  }
}