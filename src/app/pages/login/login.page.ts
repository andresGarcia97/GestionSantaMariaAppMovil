import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LOGIN_EXITOSO } from 'src/app/models/mensajes';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { LoginService } from 'src/app/services/login/login.service';
import { User } from '../../models/interfaces';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  autenticacion: User = new User();

  constructor(private loginService: LoginService, private estudiante: EstudianteService
    , private navCrtl: NavController, private alertas: AlertsService) { }

  ngOnInit() {
  }

  public async login() {
    await this.loginService.login(this.autenticacion);
    const loginExito = await this.loginService.validarToken();
    if (loginExito) {
      await this.estudiante.getEstudiante(this.autenticacion);
      this.alertas.showToast(LOGIN_EXITOSO, 'success');
      this.navCrtl.navigateRoot('/main/tabs/tab1', { animated: true });
    }
  }

}
