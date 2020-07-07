import { Component, OnInit } from '@angular/core';
import { User } from '../../models/interfaces';
import { Estudiante } from "../../models/Estudiante";
import { UsuarioService } from 'src/app/services/user/usuario.service';
import { ACTUALIZACION_USUARIO_EXITOSA, ACTUALIZACION_USUARIO_ERRONEA, MENSAJE_ERROR } from 'src/app/models/mensajes';
import { AlertsService } from '../../services/alerts/alerts.service';
import { LoginService } from '../../services/login/login.service';
import { NavController } from '@ionic/angular';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';

@Component({
  selector: 'app-updateuser',
  templateUrl: './updateuser.page.html',
  styleUrls: ['./updateuser.page.scss'],
})
export class UpdateuserPage implements OnInit {

  public usuario: Estudiante;
  public retorno: Estudiante;

  constructor(private userService: UsuarioService, public alerts: AlertsService
    , private autenticado: LoginService, private navCtrl: NavController
    , private datosEstudiante: EstudianteService) { }

  ngOnInit() {
    this.retorno = JSON.stringify(this.datosEstudiante.obtenerEstudiante());
    console.log(this.retorno);
    this.usuario = this.retorno;
    console.log(this.usuario);

    /*this.identificacion = parseInt(this.autenticado.token, 10);
    console.log(this.identificacion);
    this.usuario.identificacion = this.identificacion;
    console.log(this.usuario);*/
  }

  public update() {
    console.log(this.usuario);
    this.userService.update(this.usuario)
      .subscribe(data => {
        this.alerts.showToast(ACTUALIZACION_USUARIO_EXITOSA, 'success');
        this.navCtrl.navigateRoot('/main/tabs/tab1', { animated: true });
      }, err => {
        this.alerts.presentAlert(MENSAJE_ERROR, ACTUALIZACION_USUARIO_ERRONEA);
      });
  }

}
