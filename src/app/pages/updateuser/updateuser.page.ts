import { Component, OnInit } from '@angular/core';
import { ACTUALIZACION_USUARIO_ERRONEA, ACTUALIZACION_USUARIO_EXITOSA, MENSAJE_ERROR } from 'src/app/models/mensajes';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { UsuarioService } from 'src/app/services/user/usuario.service';
import { Estudent } from '../../models/Estudiante';
import { User } from '../../models/interfaces';
import { AlertsService } from '../../services/alerts/alerts.service';

@Component({
  selector: 'app-updateuser',
  templateUrl: './updateuser.page.html',
  styleUrls: ['./updateuser.page.scss'],
})
export class UpdateuserPage implements OnInit {

  protected usuario: Estudent;
  protected actualizacion = new User();
  mostrarInfo = false;

  constructor(private userService: UsuarioService, public alerts: AlertsService
    , private datosEstudiante: EstudianteService) { }

  async ngOnInit() {
    this.mostrarInfo = false;
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
    this.mostrarInfo = true;
    return this.actualizacion;
  }

  public async update() {
    this.usuarioValido();
    (await this.userService.update(this.actualizacion))
      .subscribe(async () => {
        await this.datosEstudiante.getEstudiante(this.actualizacion);
        this.alerts.showToast(ACTUALIZACION_USUARIO_EXITOSA, 'success');
        setTimeout(async () => {
          await this.ngOnInit();
        }, 500);
      }, () => {
        this.alerts.presentAlert(MENSAJE_ERROR, ACTUALIZACION_USUARIO_ERRONEA);
      });
  }

}
