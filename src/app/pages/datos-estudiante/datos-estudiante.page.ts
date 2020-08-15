import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Estudent } from 'src/app/models/Estudiante';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { UNIVERSIDAD_UCO, UNIVERSIDAD_UDEA } from '../../models/constantes';
import {
  ACTUALIZACION_FIRMA_UNIVERSIDAD_ERRONEA, ACTUALIZACION_FIRMA_UNIVERSIDAD_EXITOSA,
  ERROR_FALTA_FIRMA_UNIVERSIDAD, MENSAJE_ERROR, ERROR_AL_CARGAR_LA_IMAGEN, INFO_TODAVIA_NO_TIENE_FIRMA
} from '../../models/mensajes';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-datos-estudiante',
  templateUrl: './datos-estudiante.page.html',
  styleUrls: ['./datos-estudiante.page.scss'],
})
export class DatosEstudiantePage implements OnInit {

  uco = UNIVERSIDAD_UCO;
  udea = UNIVERSIDAD_UDEA;
  base64Image: any;
  estudiante: Estudent = new Estudent();
  image: any;

  constructor(private datosEstudiante: EstudianteService, private camera: Camera,
    private alertas: AlertsService, private navCrtl: NavController) { }

  obtenerUniversidad(event) {
    this.estudiante.universidad = event.detail.value;
    console.log(this.estudiante);
    return this.estudiante;
  }

  async ngOnInit() {
    await this.datosEstudiante.obtenerEstudiante();
    await this.datosEstudiante.obtenerFirma();
    this.estudiante.identificacion = this.datosEstudiante.estudiante.identificacion;
    this.estudiante.tipoUsuario = this.datosEstudiante.estudiante.tipoUsuario;
    this.estudiante.firma = this.datosEstudiante.firma;
    this.estudiante.universidad = this.datosEstudiante.estudiante.universidad;
    this.mostrarfirmaActual();
  }

  async mostrarfirmaActual() {
    if (!this.estudiante.firma) {
      this.alertas.showToast(INFO_TODAVIA_NO_TIENE_FIRMA, 'secondary');
    }
    else {
      this.image = new Image();
      this.image = 'data:image/jpeg;base64,' + this.estudiante.firma;
      return this.image;
    }
  }

  galeria() {
    const options: CameraOptions = {
      quality: 90,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.base64Image = new Image();
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.estudiante.firma = imageData;
      return this.base64Image;
    }, (err) => {
      this.alertas.showToast(ERROR_AL_CARGAR_LA_IMAGEN, 'warning');
    });
  }

  enviar() {
    if (!this.estudiante.firma || !this.estudiante.firma) {
      this.alertas.presentAlert(MENSAJE_ERROR, ERROR_FALTA_FIRMA_UNIVERSIDAD);
    }
    else {
      this.datosEstudiante.agregarFirmaYUniversidad(this.estudiante)
        .subscribe(async (data: string) => {
          console.log(this.estudiante.firma);
          this.alertas.showToast(ACTUALIZACION_FIRMA_UNIVERSIDAD_EXITOSA, 'success');
          await this.datosEstudiante.getEstudiante(this.estudiante);
          this.navCrtl.navigateRoot('/main/tabs/tab1', { animated: true });
        }, async error => {
          this.alertas.presentAlert(MENSAJE_ERROR, ACTUALIZACION_FIRMA_UNIVERSIDAD_ERRONEA);
        });
    }
  }
}
