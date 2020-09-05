import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LOGIN_ERRONEO, LOGIN_EXITOSO, MENSAJE_ERROR } from 'src/app/models/mensajes';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { LoginService } from 'src/app/services/login/login.service';
import { User } from '../../models/interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  autenticacion: User = new User();

  constructor(private loginService: LoginService, private estudianteService: EstudianteService
    , private navCrtl: NavController, private alertas: AlertsService) { }

  public async login() {
    await this.loginService.login(this.autenticacion);
    setTimeout(async () => {
      await this.estudianteService.getEstudiante(this.autenticacion);
    }, 400);
    setTimeout(async () => {
      const loginSuccess = await this.loginService.validarToken();
      if (loginSuccess) {
        this.alertas.showToast(LOGIN_EXITOSO, 'success', 1000);
        this.navCrtl.navigateRoot('/main/tabs/tab1', { animated: true });
      }
      else {
        this.alertas.presentAlert(MENSAJE_ERROR, LOGIN_ERRONEO);
      }
    }, 200);
  }
}

