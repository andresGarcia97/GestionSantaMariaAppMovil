import { Component, OnInit } from '@angular/core';
import { UNIVERSIDAD_UCO, UNIVERSIDAD_UDEA } from '../../models/constantes';
import { Estudent } from 'src/app/models/Estudiante';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

declare var window: any;

@Component({
  selector: 'app-datos-estudiante',
  templateUrl: './datos-estudiante.page.html',
  styleUrls: ['./datos-estudiante.page.scss'],
})
export class DatosEstudiantePage implements OnInit {

  tempImage: string[] = [];

  uco = UNIVERSIDAD_UCO;
  udea = UNIVERSIDAD_UDEA;
  estudiante: Estudent = new Estudent();

  constructor(private datosEstudiante: EstudianteService, private camera: Camera) { }

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

  camara() {
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     const img = window.Ionic.WebView.convertFileSrc(imageData);
     console.log(img);
     this.tempImage.push(img);
    }, (err) => {
     // Handle error
    });
  }

  galeria() {

  }

}
