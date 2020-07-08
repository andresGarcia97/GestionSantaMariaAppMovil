import { Component } from '@angular/core';
import { Componente } from 'src/app/models/interfaces';
import { LoginService } from 'src/app/services/login/login.service';
import { AlertsService } from '../../services/alerts/alerts.service';
import { LOGOUT_EXITOSO } from 'src/app/models/mensajes';

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
