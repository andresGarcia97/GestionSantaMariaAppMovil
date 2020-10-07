import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HorariosLozaPage } from './horarios-loza.page';

const routes: Routes = [
  {
    path: '',
    component: HorariosLozaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HorariosLozaPageRoutingModule { }
