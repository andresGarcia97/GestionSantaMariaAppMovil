import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateuserPageRoutingModule } from './updateuser-routing.module';

import { UpdateuserPage } from './updateuser.page';
import { HeaderComponent } from 'src/app/components/header/header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateuserPageRoutingModule,
  ],
  declarations: [UpdateuserPage, HeaderComponent]
})
export class UpdateuserPageModule {}
