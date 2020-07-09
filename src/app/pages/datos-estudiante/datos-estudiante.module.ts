import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { DatosEstudiantePageRoutingModule } from './datos-estudiante-routing.module';
import { DatosEstudiantePage } from './datos-estudiante.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosEstudiantePageRoutingModule,
    ComponentsModule
  ],
  declarations: [DatosEstudiantePage]
})
export class DatosEstudiantePageModule { }
