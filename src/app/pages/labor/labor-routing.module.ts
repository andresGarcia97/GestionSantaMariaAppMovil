import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LaborPage } from './labor.page';

const routes: Routes = [
  {
    path: '',
    component: LaborPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LaborPageRoutingModule { }
