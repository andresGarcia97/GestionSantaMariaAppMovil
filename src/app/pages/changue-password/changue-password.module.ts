import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/components/components.module';
import { ChanguePasswordPageRoutingModule } from './changue-password-routing.module';
import { ChanguePasswordPage } from './changue-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChanguePasswordPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ChanguePasswordPage]
})
export class ChanguePasswordPageModule {}
