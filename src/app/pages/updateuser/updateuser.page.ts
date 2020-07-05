import { Component, OnInit } from '@angular/core';
import { User } from '../../models/interfaces';
import { UsuarioService } from 'src/app/services/user/usuario.service';
import { ACTUALIZACION_USUARIO_EXITOSA, ACTUALIZACION_USUARIO_ERRONEA, MENSAJE_ERROR } from 'src/app/models/mensajes';
import { AlertsService } from '../../services/alerts/alerts.service';
import { LoginService } from '../../services/login/login.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-updateuser',
  templateUrl: './updateuser.page.html',
  styleUrls: ['./updateuser.page.scss'],
})
export class UpdateuserPage implements OnInit {

  public usuario: User = new User();
  private usuarioAutenticado: any;

  constructor(private userService: UsuarioService, public alerts: AlertsService
            , private autenticado: LoginService, private navCtrl: NavController) { }

  ngOnInit() {
    this.usuarioAutenticado = this.autenticado.obtenerUsuario();
    if (this.usuarioAutenticado != null) {
      this.usuario.identificacion = this.usuarioAutenticado.identificacion;
    }
    else{
      this.navCtrl.navigateRoot('/login', { animated: true });
    }
    console.log(this.usuarioAutenticado);
    console.log(this.usuario);
  }

  public update() {
    this.userService.update(this.usuario)
      .subscribe(data => {
        this.alerts.showToast(ACTUALIZACION_USUARIO_EXITOSA, 'success');
        this.navCtrl.navigateRoot('/main/tabs/tab1', { animated: true });
      }, err => {
        this.alerts.presentAlert(MENSAJE_ERROR, ACTUALIZACION_USUARIO_ERRONEA);
      });
  }

}
