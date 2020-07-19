import { Component, OnInit } from '@angular/core';
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

  constructor(private loginService: LoginService, private estudiante: EstudianteService) { }

  ngOnInit() {
  }

  public async login() {
    await this.estudiante.getEstudiante(this.autenticacion);
    await this.loginService.login(this.autenticacion);
  }

}
