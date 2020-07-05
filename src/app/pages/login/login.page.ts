import { Component, OnInit } from '@angular/core';
import { User } from '../../models/interfaces';
import { LoginService } from 'src/app/services/login/login.service';
import { ToastController, NavController } from '@ionic/angular';
import { LOGIN_EXITOSO, LOGIN_ERRONEO, MENSAJE_ERROR } from '../../models/mensajes';
import { AlertsService } from '../../services/alerts/alerts.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  autenticacion: User = new User();
  mensaje: string;
  autenticado: User = null;

  constructor(private loginService: LoginService, private navCtrl: NavController, private alertas: AlertsService) { }

  ngOnInit() {
    this.autenticado = this.loginService.obtenerUsuario();
    if (this.autenticado != null) {
      this.navCtrl.navigateRoot('/main/tabs/tab1', { animated: true });
    }
  }

  public login() {
    this.loginService.login(this.autenticacion)
      .subscribe((data: User) => {
        this.loginService.guardarUsuario(data);
        this.alertas.showToast(LOGIN_EXITOSO, 'success');
        this.navCtrl.navigateRoot('/main/tabs/tab1', { animated: true });
      }, error => {
        this.loginService.autenticado = null;
        this.loginService.borrarUsuario();
        this.alertas.presentAlert(MENSAJE_ERROR, LOGIN_ERRONEO);
      });
    this.autenticacion = new User();
  }

}
