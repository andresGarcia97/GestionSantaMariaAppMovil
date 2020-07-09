import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateuserPageRoutingModule } from './updateuser-routing.module';

import { UpdateuserPage } from './updateuser.page';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateuserPageRoutingModule,
    ComponentsModule
  ],
  declarations: [UpdateuserPage]
})
export class UpdateuserPageModule {}
