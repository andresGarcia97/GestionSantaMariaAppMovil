import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../../components/components.module';
import { UpdateuserPageRoutingModule } from './updateuser-routing.module';
import { UpdateuserPage } from './updateuser.page';

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
export class UpdateuserPageModule { }
