import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UpdateReservaPageRoutingModule } from './update-reserva-routing.module';
import { UpdateReservaPage } from './update-reserva.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateReservaPageRoutingModule
  ],
  declarations: [UpdateReservaPage]
})
export class UpdateReservaPageModule { }
