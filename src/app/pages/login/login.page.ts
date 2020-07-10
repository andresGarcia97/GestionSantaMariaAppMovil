import { Component, OnInit } from '@angular/core';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { LoginService } from 'src/app/services/login/login.service';
import { User } from '../../models/interfaces';
import { AlertsService } from '../../services/alerts/alerts.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  autenticacion: User = new User();
  mensaje: string;

  constructor(private loginService: LoginService, private alertas: AlertsService,
    private estudiante: EstudianteService) { }

  ngOnInit() {
  }

  public login() {
    this.loginService.login(this.autenticacion);
    this.estudiante.guardarEstudiante(this.estudiante.getEstudiante(this.autenticacion));
  }

}
