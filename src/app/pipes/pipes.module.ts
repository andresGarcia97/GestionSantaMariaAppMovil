import { NgModule } from '@angular/core';
import { FiltroReservaPipe } from './filtro-reserva/filtro-reserva.pipe';

@NgModule({
  declarations: [FiltroReservaPipe],
  exports: [FiltroReservaPipe]
})
export class PipesModule { }
