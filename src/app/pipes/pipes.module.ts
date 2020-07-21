import { NgModule } from '@angular/core';
import { FiltroLavadoLozaPipe } from './filtro-lavado-loza/filtro-lavado-loza.pipe';
import { FiltroReservaPipe } from './filtro-reserva/filtro-reserva.pipe';

@NgModule({
  declarations: [FiltroReservaPipe, FiltroLavadoLozaPipe],
  exports:
    [FiltroReservaPipe,
      FiltroLavadoLozaPipe]
})
export class PipesModule { }
