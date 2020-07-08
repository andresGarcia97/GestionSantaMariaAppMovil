import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ACTUALIZACION_USUARIO_ERRONEA, ACTUALIZACION_USUARIO_EXITOSA, MENSAJE_ERROR } from 'src/app/models/mensajes';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { UsuarioService } from 'src/app/services/user/usuario.service';
import { Estudiante } from '../../models/Estudiante';
import { User } from '../../models/interfaces';
import { AlertsService } from '../../services/alerts/alerts.service';

@Component({
  selector: 'app-updateuser',
  templateUrl: './updateuser.page.html',
  styleUrls: ['./updateuser.page.scss'],
})
export class UpdateuserPage implements OnInit {

  protected usuario: Estudiante;
  protected actualizacion = new User();

  constructor(private userService: UsuarioService, public alerts: AlertsService
    , private navCtrl: NavController, private datosEstudiante: EstudianteService) { }

  async ngOnInit() {
    await this.datosEstudiante.obtenerEstudiante();
    this.usuario = this.datosEstudiante.estudiante;
    this.usuarioValido();
  }

  public usuarioValido(): User {
    this.actualizacion.identificacion = this.usuario.identificacion;
    if (!this.actualizacion.nombre) {
      this.actualizacion.nombre = this.usuario.nombre;
    }
    if (!this.actualizacion.apellido) {
      this.actualizacion.apellido = this.usuario.apellido;
    }
    if (!this.actualizacion.telefono) {
      this.actualizacion.telefono = this.usuario.telefono;
    }
    if (!this.actualizacion.correo) {
      this.actualizacion.correo = this.usuario.correo;
    }
    return this.actualizacion;
  }

  public update() {
    console.log(this.actualizacion);
    this.usuarioValido();
    this.userService.update(this.actualizacion)
      .subscribe(data => {
        this.alerts.showToast(ACTUALIZACION_USUARIO_EXITOSA, 'success');
        this.datosEstudiante.getEstudiante(this.actualizacion);
        this.navCtrl.navigateRoot('/main/tabs/tab1', { animated: true });
      }, err => {
        this.alerts.presentAlert(MENSAJE_ERROR, ACTUALIZACION_USUARIO_ERRONEA);
      });
  }

  public devolverse() {
    this.navCtrl.navigateRoot('/main/tabs/tab1', { animated: true });
  }

}
