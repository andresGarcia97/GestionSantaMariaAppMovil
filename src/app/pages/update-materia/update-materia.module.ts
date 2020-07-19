import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UpdateMateriaPageRoutingModule } from './update-materia-routing.module';
import { UpdateMateriaPage } from './update-materia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateMateriaPageRoutingModule
  ],
  declarations: [UpdateMateriaPage]
})
export class UpdateMateriaPageModule { }
