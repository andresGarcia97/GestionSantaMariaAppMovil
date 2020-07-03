import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosEstudiantePageRoutingModule } from './datos-estudiante-routing.module';

import { DatosEstudiantePage } from './datos-estudiante.page';
import { HeaderComponent } from 'src/app/components/header/header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosEstudiantePageRoutingModule
  ],
  declarations: [DatosEstudiantePage, HeaderComponent]
})
export class DatosEstudiantePageModule {}
