import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateuserPage } from './updateuser.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateuserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateuserPageRoutingModule {}
