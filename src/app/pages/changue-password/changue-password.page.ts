import { Component, OnInit } from '@angular/core';
import { CambioPassword } from 'src/app/models/interfaces';
import { ACTUALIZACION_CONTRASENA_EXITOSA, ACTUALIZACION_FIRMA_CONTRASENA_ERRONEA, MENSAJE_ERROR } from 'src/app/models/mensajes';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { UsuarioService } from 'src/app/services/user/usuario.service';

@Component({
  selector: 'app-changue-password',
  templateUrl: './changue-password.page.html',
  styleUrls: ['./changue-password.page.scss'],
})
export class ChanguePasswordPage implements OnInit {

  protected contrasenas = new CambioPassword();

  constructor(private datosEstudiante: EstudianteService, private usuarioService: UsuarioService
    , private alertas: AlertsService) { }

  async ngOnInit() {
    await this.datosEstudiante.obtenerEstudiante();
    this.contrasenas.identificacion = this.datosEstudiante.estudiante.identificacion;
    return this.contrasenas;
  }

  protected async update() {
    (await this.usuarioService.updatePassword(this.contrasenas))
      .subscribe(() => {
        this.alertas.showToast(ACTUALIZACION_CONTRASENA_EXITOSA, 'success');
        setTimeout(async () => {
          this.contrasenas = new CambioPassword();
          await this.ngOnInit();
        }, 200);
      }, async error => {
        if (error.status === 400) {
          this.alertas.presentAlert(MENSAJE_ERROR, error.error);
        }
        else {
          this.alertas.presentAlert(MENSAJE_ERROR, ACTUALIZACION_FIRMA_CONTRASENA_ERRONEA);
        }
      });
  }

}
