import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateMateriaPage } from './update-materia.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateMateriaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateMateriaPageRoutingModule { }
