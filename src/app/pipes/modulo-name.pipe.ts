import { Pipe, PipeTransform } from '@angular/core';
import { ModuloRequest } from '../services/modulo.service';

@Pipe({
  name: 'moduloName',
  standalone: true
})
export class ModuloNamePipe implements PipeTransform {

  transform(idModulo: number | undefined, modulos: ModuloRequest[]): string {
    if (!idModulo || !modulos || modulos.length === 0) {
      return 'Sin módulo';
    }
    
    const modulo = modulos.find(m => m.IdModulo === idModulo);
    return modulo?.Nombre || 'Módulo desconocido';
  }
}