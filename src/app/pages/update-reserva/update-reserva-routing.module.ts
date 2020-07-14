import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateReservaPage } from './update-reserva.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateReservaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateReservaPageRoutingModule {}
