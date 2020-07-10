import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { LaborPageRoutingModule } from './labor-routing.module';
import { LaborPage } from './labor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LaborPageRoutingModule,
    ComponentsModule
  ],
  declarations: [LaborPage]
})
export class LaborPageModule { }
