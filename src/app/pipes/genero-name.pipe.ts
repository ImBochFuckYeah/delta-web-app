import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'generoName',
  standalone: true
})
export class GeneroNamePipe implements PipeTransform {
  transform(generoId: number, generos: any[]): string {
    if (!generoId || !generos || !Array.isArray(generos)) {
      return generoId?.toString() || 'N/A';
    }

    const genero = generos.find(g => g.IdGenero === generoId);
    return genero ? genero.Nombre : generoId.toString();
  }
}
