import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { LOGOUT_EXITOSO } from 'src/app/models/mensajes';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { LoginService } from 'src/app/services/login/login.service';
import { Componente } from '../../models/interfaces';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {

  menuUsuarios: Componente[] = [
    {
      icon: 'finger-print-outline',
      name: 'Actualizar Usuario',
      redirectTo: '/updateuser'
    },
    {
      icon: 'cloud-upload-outline',
      name: 'Firma Y Universidad',
      redirectTo: '/datos-estudiante'
    },
    {
      icon: 'calendar-outline',
      name: 'Consultar Labores',
      redirectTo: '/labor'
    },
    {
      icon: 'cafe-outline',
      name: 'Lavado de Loza',
      redirectTo: '/horarios-loza'
    },
    {
      icon: 'key-outline',
      name: 'Contraseña',
      redirectTo: '/changue-password'
    }
  ];

  constructor(private login: LoginService, private notificaciones: AlertsService,
    private menuCtrl: MenuController) { }

  toggleDarkMode = () => {
    document.body.classList.toggle('dark');
  }

  public logout() {
    this.login.logout();
    this.menuCtrl.close('first');
    this.notificaciones.showToast(LOGOUT_EXITOSO, 'success');
  }

}
