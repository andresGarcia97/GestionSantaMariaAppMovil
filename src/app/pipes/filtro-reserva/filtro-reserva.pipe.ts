import { Pipe, PipeTransform } from '@angular/core';
import { Reserva } from 'src/app/models/interfaces';

@Pipe({
  name: 'filtroReserva'
})
export class FiltroReservaPipe implements PipeTransform {

  transform(arreglo: Reserva[],
            texto: string,
            columna: string): any[] {

    if (texto === '') {
      return arreglo;
    }

    texto = texto.toLowerCase();

    return arreglo.filter(item => {
      return item.espacio.toLowerCase()
        .includes(texto);
    });

  }

}
