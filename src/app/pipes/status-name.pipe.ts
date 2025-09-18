import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusName',
  standalone: true
})
export class StatusNamePipe implements PipeTransform {
  transform(statusId: any, statusList: any[]): string {
    // Manejar valores nulos/undefined
    if (statusId === null || statusId === undefined) {
      return 'N/A';
    }

    // Convertir a número
    const id = Number(statusId);
    if (isNaN(id)) {
      return statusId.toString();
    }

    // Verificar que tenemos status para buscar
    if (!statusList || !Array.isArray(statusList) || statusList.length === 0) {
      return id.toString();
    }

    // Buscar el status
    const status = statusList.find(s => Number(s.IdStatusUsuario) === id);
    return status ? status.Nombre : id.toString();
  }
}
