import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { NavController } from '@ionic/angular';
import { Estudent } from 'src/app/models/Estudiante';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { UNIVERSIDAD_UCO, UNIVERSIDAD_UDEA } from '../../models/constantes';
import {
  ACTUALIZACION_FIRMA_UNIVERSIDAD_ERRONEA, ACTUALIZACION_FIRMA_UNIVERSIDAD_EXITOSA,
  ERROR_AL_CARGAR_LA_IMAGEN, ERROR_FALTA_FIRMA_UNIVERSIDAD,
  IMAGEN_MUY_PESADA, INFO_TODAVIA_NO_TIENE_FIRMA, INFO_TODAVIA_NO_TIENE_UNIVERSIDAD,
  MENSAJE_ADVERTENCIA, MENSAJE_ERROR
} from '../../models/mensajes';

@Component({
  selector: 'app-datos-estudiante',
  templateUrl: './datos-estudiante.page.html',
  styleUrls: ['./datos-estudiante.page.scss'],
})
export class DatosEstudiantePage implements OnInit {

  uco = UNIVERSIDAD_UCO;
  udea = UNIVERSIDAD_UDEA;
  universidadActual = UNIVERSIDAD_UCO;
  base64Image: any;
  estudiante: Estudent = new Estudent();
  image: any;
  sizeImage: any;

  constructor(private datosEstudiante: EstudianteService, private camera: Camera,
    private alertas: AlertsService, private navCrtl: NavController) { }

  obtenerUniversidad(event) {
    this.estudiante.universidad = event.detail.value;
    return this.estudiante;
  }

  async ngOnInit() {
    await this.datosEstudiante.obtenerEstudiante();
    await this.datosEstudiante.obtenerFirma();
    await this.datosEstudiante.obtenerUniversidad();
    this.estudiante.identificacion = this.datosEstudiante.estudiante.identificacion;
    this.estudiante.tipoUsuario = this.datosEstudiante.estudiante.tipoUsuario;
    this.estudiante.firma = this.datosEstudiante.firma;
    this.estudiante.universidad = this.datosEstudiante.estudiante.universidad;
    await this.mostrarfirmaActual();
    await this.mostrarUniversidadActual();
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

  async mostrarUniversidadActual() {
    if (!this.estudiante.universidad) {
      this.alertas.showToast(INFO_TODAVIA_NO_TIENE_UNIVERSIDAD, 'secondary');
    }
    else if (this.estudiante.universidad.includes(UNIVERSIDAD_UCO)) {
      this.universidadActual = this.uco;
      return this.universidadActual;
    }
    else if (this.estudiante.universidad.includes(UNIVERSIDAD_UDEA)) {
      this.universidadActual = this.udea;
      return this.universidadActual;
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

  private calcularSizeImageInKB(): number {
    return ((this.estudiante.firma.length * (3 / 4)) - 2) / 1000;
  }

  enviar() {
    if (!this.estudiante.firma || !this.estudiante.firma) {
      this.alertas.presentAlert(MENSAJE_ERROR, ERROR_FALTA_FIRMA_UNIVERSIDAD);
    }
    // si la imagen pesa más de un 1MB no se dejara enviar
    else if (this.calcularSizeImageInKB() > 1000) {
      this.alertas.presentAlert(MENSAJE_ADVERTENCIA, IMAGEN_MUY_PESADA);
    }
    else {
      this.datosEstudiante.agregarFirmaYUniversidad(this.estudiante)
        .subscribe(async (data: string) => {
          this.alertas.showToast(ACTUALIZACION_FIRMA_UNIVERSIDAD_EXITOSA, 'success');
          await this.datosEstudiante.getEstudiante(this.estudiante);
          this.navCrtl.navigateRoot('/main/tabs/tab1', { animated: true });
        }, async error => {
          if (error.status === 400) {
            this.alertas.presentAlert(MENSAJE_ERROR, error.error);
          }
          else{
            this.alertas.presentAlert(MENSAJE_ERROR, ACTUALIZACION_FIRMA_UNIVERSIDAD_ERRONEA);
          }
        });
    }
  }
}
