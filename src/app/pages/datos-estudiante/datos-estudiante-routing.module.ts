import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatosEstudiantePage } from './datos-estudiante.page';

const routes: Routes = [
  {
    path: '',
    component: DatosEstudiantePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosEstudiantePageRoutingModule { }
