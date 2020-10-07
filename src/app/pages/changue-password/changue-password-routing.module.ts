import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChanguePasswordPage } from './changue-password.page';

const routes: Routes = [
  {
    path: '',
    component: ChanguePasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChanguePasswordPageRoutingModule { }
