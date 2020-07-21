import { Pipe, PipeTransform } from '@angular/core';
import { LavadoLoza } from '../../models/interfaces';

@Pipe({
  name: 'filtroLavadoLoza'
})
export class FiltroLavadoLozaPipe implements PipeTransform {

  transform(arreglo: LavadoLoza[], texto: string): any[] {
    if (texto === '' || texto == null) {
      return arreglo;
    }

    texto = texto.toLowerCase();

    return arreglo.filter(item => {
      return item.dia.toLowerCase()
      .includes(texto);
    });
  }

}
