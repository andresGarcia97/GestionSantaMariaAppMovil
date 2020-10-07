import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { LaborPageRoutingModule } from './labor-routing.module';
import { LaborPage } from './labor.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    LaborPageRoutingModule,
    ComponentsModule
  ],
  declarations: [LaborPage]
})
export class LaborPageModule { }
