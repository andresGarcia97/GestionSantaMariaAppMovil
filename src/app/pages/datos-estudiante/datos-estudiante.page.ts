import { Component, OnInit } from '@angular/core';
import { UNIVERSIDAD_UCO, UNIVERSIDAD_UDEA } from '../../models/constantes';
import { Estudent } from 'src/app/models/Estudiante';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';

@Component({
  selector: 'app-datos-estudiante',
  templateUrl: './datos-estudiante.page.html',
  styleUrls: ['./datos-estudiante.page.scss'],
})
export class DatosEstudiantePage implements OnInit {

  uco = UNIVERSIDAD_UCO;
  udea = UNIVERSIDAD_UDEA;
  estudiante: Estudent = new Estudent();

  constructor(private datosEstudiante: EstudianteService) { }

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

}
