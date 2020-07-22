import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { MENSAJE_ERROR } from 'src/app/models/mensajes';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { MateriasService } from 'src/app/services/materias/materias.service';
import {
  DIA_DOMINGO, DIA_JUEVES, DIA_LUNES, DIA_MARTES, DIA_MIERCOLES, DIA_SABADO, DIA_VIERNES,
  HORA_MAXIMA_MATERIA, HORA_MINIMA_MATERIA
} from '../../models/constantes';
import { Horario, Materia, User } from '../../models/interfaces';
import {
  ACTUALIZACION_MATERIA_ERRONEA, ACTUALIZACION_MATERIA_EXITOSA, ERROR_DIA_VACIO, ERROR_HORAS_INVALIDAS,
  ERROR_HORA_INICIAL_MAYOR_QUE_HORA_FINAL, ERROR_MATERIA_CANTIDAD_HORARIOS, ERROR_NOMBRE_MATERIA, INFO_ADICION_HORARIO
} from '../../models/mensajes';

@Component({
  selector: 'app-update-materia',
  templateUrl: './update-materia.page.html',
  styleUrls: ['./update-materia.page.scss'],
})
export class UpdateMateriaPage implements OnInit {

  @Input() viejaMateria: Materia;

  lunes = DIA_LUNES; martes = DIA_MARTES; miercoles = DIA_MIERCOLES;
  jueves = DIA_JUEVES; viernes = DIA_VIERNES; sabado = DIA_SABADO; domingo = DIA_DOMINGO;
  nuevaMateria = new Materia();
  nuevoHorario = new Horario();
  materias: Materia[] = [];
  usuario = new User();

  constructor(private alerta: AlertsService, private modalCtrl: ModalController
    , private materiaService: MateriasService, private datosEstudiante: EstudianteService
    , private alertController: AlertController) { }

  async ngOnInit() {
    this.nuevoHorario.horaInicial = new Date();
    this.nuevoHorario.horaFinal = new Date();
    const materiaString = JSON.stringify(this.viejaMateria);
    this.nuevaMateria = JSON.parse(materiaString);
    this.nuevaMateria.horarios = [];
    await this.datosEstudiante.obtenerEstudiante();
    this.usuario.identificacion = this.datosEstudiante.estudiante.identificacion;
    this.nuevaMateria.estudiante = this.usuario;
    this.viejaMateria.estudiante = this.usuario;
    return this.nuevaMateria;
  }

  cambioHoraInicial(event) {
    this.nuevoHorario.horaInicial = new Date(event.detail.value);
  }
  cambioHoraFinal(event) {
    this.nuevoHorario.horaFinal = new Date(event.detail.value);
  }
  obtenerDia(event) {
    this.nuevoHorario.dia = event.detail.value;
  }

  private validarDia(): boolean {
    if (!this.nuevoHorario.dia) {
      return true;
    }
    return false;
  }

  private validarNombre(): boolean {
    if (!this.nuevaMateria.nombreMateria || this.nuevaMateria.nombreMateria === '') {
      return true;
    }
    return false;
  }

  private validarHoras(): boolean {
    if (this.nuevoHorario.horaFinal.getHours() > HORA_MAXIMA_MATERIA ||
      this.nuevoHorario.horaInicial.getHours() >= HORA_MAXIMA_MATERIA ||
      this.nuevoHorario.horaFinal.getHours() <= HORA_MINIMA_MATERIA ||
      this.nuevoHorario.horaInicial.getHours() < HORA_MINIMA_MATERIA) {
      return true;
    }
    return false;
  }

  private validarHoraFinalMayor(): boolean {
    if (this.nuevoHorario.horaInicial.getHours() >= this.nuevoHorario.horaFinal.getHours()) {
      return true;
    }
    return false;
  }

  private reiniciarHorario(): Horario {
    this.nuevoHorario = new Horario();
    this.nuevoHorario.horaInicial = new Date();
    this.nuevoHorario.horaFinal = new Date();
    return this.nuevoHorario;
  }

  crearHorario() {
    if (this.validarNombre()) {
      this.alerta.presentAlert(MENSAJE_ERROR, ERROR_NOMBRE_MATERIA);
    }
    else if (this.validarDia()) {
      this.alerta.presentAlert(MENSAJE_ERROR, ERROR_DIA_VACIO);
    }
    else if (this.validarHoras()) {
      this.alerta.presentAlert(MENSAJE_ERROR, ERROR_HORAS_INVALIDAS);
    }
    else if (this.validarHoraFinalMayor()) {
      this.alerta.presentAlert(MENSAJE_ERROR, ERROR_HORA_INICIAL_MAYOR_QUE_HORA_FINAL);
    }
    else {
      this.nuevaMateria.horarios.push(this.nuevoHorario);
      this.reiniciarHorario();
      this.alerta.showToast(INFO_ADICION_HORARIO.concat(this.nuevaMateria.nombreMateria), 'secondary', 1000);
      return this.nuevaMateria;
    }
  }

  cancelarUpdate() {
    this.modalCtrl.dismiss();
  }

  actualizarMateria() {
    if (this.validarNombre()) {
      this.alerta.presentAlert(MENSAJE_ERROR, ERROR_NOMBRE_MATERIA);
    }
    else if (this.nuevaMateria.horarios.length <= 0) {
      this.alerta.presentAlert(MENSAJE_ERROR, ERROR_MATERIA_CANTIDAD_HORARIOS);
    }
    else {
      this.materias.push(this.viejaMateria);
      this.materias.push(this.nuevaMateria);
      this.materiaService.updateMateria(this.materias).
        subscribe(async (data: string) => {
          this.alerta.showToast(ACTUALIZACION_MATERIA_EXITOSA, 'success');
          this.datosEstudiante.getEstudiante(this.nuevaMateria.estudiante);
          this.modalCtrl.dismiss();
        }, async error => {
          if (error.status === 400) {
            this.alerta.presentAlert(MENSAJE_ERROR, error.error);
          }
          else {
            this.alerta.presentAlert(MENSAJE_ERROR, ACTUALIZACION_MATERIA_ERRONEA);
          }
        });
      this.materias = [];
    }
  }

}
