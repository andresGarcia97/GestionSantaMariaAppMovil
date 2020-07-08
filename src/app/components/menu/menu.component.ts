import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login/login.service';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { LOGOUT_EXITOSO } from 'src/app/models/mensajes';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor(private login: LoginService, private notificaciones: AlertsService,
    private menuCtrl: MenuController) { }

  ngOnInit() {}

  public logout(){
    this.login.logout();
    this.menuCtrl.close('first');
    this.notificaciones.showToast(LOGOUT_EXITOSO, 'success');
  }

}
