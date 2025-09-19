import { Pipe, PipeTransform } from '@angular/core';
import { EmpresaObj } from '../services/empresa.service';

@Pipe({
  name: 'empresaName'
})
export class EmpresaNamePipe implements PipeTransform {

  transform(idEmpresa: number, empresas: EmpresaObj[]): string {
    if (!empresas || !idEmpresa) return '';
    const empresa = empresas.find(e => e.IdEmpresa === idEmpresa);
    return empresa ? empresa.Nombre : '';
  }

}
