// sucursal-name.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sucursalName'

})
export class SucursalNamePipe implements PipeTransform {
  transform(idSucursal: number, sucursales: any[]): string {
    // Validaciones
    if (idSucursal === null || idSucursal === undefined) {
      return 'Sin sucursal';
    }

    if (!sucursales || !Array.isArray(sucursales) || sucursales.length === 0) {
      return 'Cargando...';
    }

    // Buscar la sucursal
    const sucursal = sucursales.find(s => s.IdSucursal === idSucursal);

    if (!sucursal) {
      return `Sucursal ${idSucursal}`;
    }

    return sucursal.Nombre || `Sucursal ${idSucursal}`;
  }
}
