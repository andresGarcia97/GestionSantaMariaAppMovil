import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Estudent } from 'src/app/models/Estudiante';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { LoginService } from 'src/app/services/login/login.service';
import { UNIVERSIDAD_UCO, UNIVERSIDAD_UDEA } from '../../models/constantes';
import {
  ACTUALIZACION_FIRMA_UNIVERSIDAD_ERRONEA, ACTUALIZACION_FIRMA_UNIVERSIDAD_EXITOSA,
  ERROR_AL_CARGAR_LA_IMAGEN, ERROR_FALTA_FIRMA_UNIVERSIDAD,
  ERROR_IMAGEN_MUY_PESADA, INFO_TODAVIA_NO_TIENE_FIRMA, INFO_TODAVIA_NO_TIENE_UNIVERSIDAD,
  LOGOUT_FORZADO,
  MENSAJE_ADVERTENCIA, MENSAJE_ERROR
} from '../../models/mensajes';

@Component({
  selector: 'app-datos-estudiante',
  templateUrl: './datos-estudiante.page.html'
})
export class DatosEstudiantePage implements OnInit {

  protected uco = UNIVERSIDAD_UCO;
  protected udea = UNIVERSIDAD_UDEA;
  protected universidadActual = UNIVERSIDAD_UCO;
  protected base64Image: any;
  private estudiante = new Estudent();
  protected image: any;
  protected firmaActual = false;
  protected nuevaFirma = false;
  protected sizeImage: any;
  protected botonEnviar = false;

  constructor(private datosEstudiante: EstudianteService, private camera: Camera,
    private alertas: AlertsService, private logoutForced: LoginService) { }

  public async ngOnInit() {
    this.firmaActual = false;
    this.nuevaFirma = false;
    this.botonEnviar = false;
    await this.mostrarfirmaActual();
    await this.mostrarUniversidadActual();
    await this.datosEstudiante.obtenerEstudiante();
    this.estudiante.identificacion = this.datosEstudiante.estudiante.identificacion;
    this.estudiante.tipoUsuario = this.datosEstudiante.estudiante.tipoUsuario;
  }

  public obtenerUniversidad(event) {
    this.estudiante.universidad = event.detail.value;
    return this.estudiante;
  }

  private async mostrarfirmaActual() {
    await this.datosEstudiante.obtenerFirma();
    this.estudiante.firma = this.datosEstudiante.firma;
    if (!this.estudiante.firma) {
      this.alertas.showToast(INFO_TODAVIA_NO_TIENE_FIRMA, 'secondary');
    }
    else {
      this.image = new Image();
      this.image = 'data:image/jpeg;base64,' + this.estudiante.firma;
      this.firmaActual = true;
      return this.image;
    }
  }

  private async mostrarUniversidadActual() {
    await this.datosEstudiante.obtenerUniversidad();
    this.estudiante.universidad = this.datosEstudiante.estudiante.universidad;
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
      this.nuevaFirma = true;
      return this.base64Image;
    }, () => {
      this.alertas.showToast(ERROR_AL_CARGAR_LA_IMAGEN, 'secondary');
    });
  }

  private calcularSizeImageInKB(): number {
    return ((this.estudiante.firma.length * (3 / 4)) - 2) / 1000;
  }

  public async enviar() {
    if (!this.estudiante.firma || !this.estudiante.firma) {
      this.alertas.presentAlert(MENSAJE_ERROR, ERROR_FALTA_FIRMA_UNIVERSIDAD);
    }
    // si la imagen pesa más de un 1MB no se dejara enviar
    else if (this.calcularSizeImageInKB() > 1000) {
      this.alertas.presentAlert(MENSAJE_ADVERTENCIA, ERROR_IMAGEN_MUY_PESADA);
    }
    else {
      this.botonEnviar = true;
      (await this.datosEstudiante.agregarFirmaYUniversidad(this.estudiante))
        .subscribe(async () => {
          this.alertas.showToast(ACTUALIZACION_FIRMA_UNIVERSIDAD_EXITOSA, 'success');
          await this.datosEstudiante.getEstudiante(this.estudiante);
          this.firmaActual = false;
          this.nuevaFirma = false;
          this.base64Image = new Image();
          this.image = new Image();
          this.estudiante = new Estudent();
          setTimeout(async () => {
            await this.ngOnInit();
          }, 300);
          this.botonEnviar = false;
        }, error => {
          if (error.status === 400) {
            this.alertas.presentAlert(MENSAJE_ERROR, error.error);
          }
          else if (error.status === 401) {
            this.alertas.presentAlert(MENSAJE_ERROR, LOGOUT_FORZADO);
            this.logoutForced.logout();
          }
          else {
            this.alertas.presentAlert(MENSAJE_ERROR, ACTUALIZACION_FIRMA_UNIVERSIDAD_ERRONEA);
          }
          this.botonEnviar = false;
        });
    }
  }
}
