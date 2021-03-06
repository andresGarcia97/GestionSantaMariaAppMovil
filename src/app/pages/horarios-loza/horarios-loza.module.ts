import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '../../components/components.module';
import { HorariosLozaPageRoutingModule } from './horarios-loza-routing.module';
import { HorariosLozaPage } from './horarios-loza.page';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    HorariosLozaPageRoutingModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [HorariosLozaPage]
})
export class HorariosLozaPageModule { }
