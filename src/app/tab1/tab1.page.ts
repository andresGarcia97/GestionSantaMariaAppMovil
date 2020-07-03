import { Component } from '@angular/core';
import { Componente } from '../interfaces/interfaces';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  menuUsuarios: Componente[] = [
    {
      icon: 'finger-print-outline',
      name: 'Actualizar Usuario',
      redirectTo: '/updateuser'
    },
    {
      icon: 'cloud-upload-outline',
      name: 'Agregar firma Y universidad',
      redirectTo: '/datos-estudiante'
    }
  ];

  constructor() { }
}
