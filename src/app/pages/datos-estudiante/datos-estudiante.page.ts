import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Estudent } from 'src/app/models/Estudiante';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { UNIVERSIDAD_UCO, UNIVERSIDAD_UDEA } from '../../models/constantes';
import {
  ACTUALIZACION_FIRMA_UNIVERSIDAD_ERRONEA, ACTUALIZACION_FIRMA_UNIVERSIDAD_EXITOSA,
  ERROR_FALTA_FIRMA_UNIVERSIDAD, MENSAJE_ERROR
} from '../../models/mensajes';

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

  constructor(private datosEstudiante: EstudianteService, private camera: Camera,
    private alertas: AlertsService) { }

  obtenerUniversidad(event) {
    this.estudiante.universidad = event.detail.value;
    console.log(this.estudiante);
    return this.estudiante;
  }

  async ngOnInit() {
    await this.datosEstudiante.obtenerEstudiante();
    this.estudiante.identificacion = this.datosEstudiante.estudiante.identificacion;
    this.estudiante.tipoUsuario = this.datosEstudiante.estudiante.tipoUsuario;
  }

  galeria() {
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };

    this.camera.getPicture(options)
      .then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        const base64Image = 'data:image/jpeg;base64,' + imageData;
        this.estudiante.firma = imageData;
        return this.estudiante;
      }, (err) => {
        // Handle error
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
        }, async error => {
          this.alertas.showToast(ACTUALIZACION_FIRMA_UNIVERSIDAD_ERRONEA, 'warning');
        });
    }
  }
}
