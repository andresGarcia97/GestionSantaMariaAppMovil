import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login/login.service';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { LOGOUT_EXITOSO } from 'src/app/models/mensajes';
import { MenuController } from '@ionic/angular';
import { Componente } from '../../models/interfaces';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  darkMode: boolean;
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

  constructor(private login: LoginService, private notificaciones: AlertsService,
              private menuCtrl: MenuController) {
  }

  ngOnInit() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.darkMode = prefersDark.matches;
  }

  cambiarModo(event) {
    this.darkMode = !this.darkMode;
    if (this.darkMode) {
      document.body.classList.toggle('dark');
      console.log(this.darkMode);
    }
  }

  public logout() {
    this.login.logout();
    this.menuCtrl.close('first');
    this.notificaciones.showToast(LOGOUT_EXITOSO, 'success');
  }

}
