import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonList, ModalController } from '@ionic/angular';
import { INFO_LISTA_VACIA, MENSAJE_ERROR } from 'src/app/models/mensajes';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import {
  DIA_DOMINGO, DIA_JUEVES, DIA_LUNES, DIA_MARTES, DIA_MIERCOLES, DIA_SABADO, DIA_VIERNES,
  HORA_MAXIMA_MATERIA, HORA_MINIMA_MATERIA
} from '../../models/constantes';
import { Horario, Materia, User } from '../../models/interfaces';
import {
  CONFIRMACION_BORRAR_MATERIA, ERROR_DIA_VACIO, ERROR_HORAS_INVALIDAS, ERROR_HORA_INICIAL_MAYOR_QUE_HORA_FINAL,
  ERROR_MATERIA_CANTIDAD_HORARIOS, ERROR_NOMBRE_MATERIA, GUARDAR_MATERIA_ERROR, GUARDAR_MATERIA_EXITO, INFO_ADICION_HORARIO,
  BORRADO_EXITOSO_MATERIA, BORRADO_FALLIDO_MATERIA
} from '../../models/mensajes';
import { UpdateMateriaPage } from '../../pages/update-materia/update-materia.page';
import { MateriasService } from '../../services/materias/materias.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  @ViewChild('lista') itemLista: IonList;

  lunes = DIA_LUNES; martes = DIA_MARTES; miercoles = DIA_MIERCOLES;
  jueves = DIA_JUEVES; viernes = DIA_VIERNES; sabado = DIA_SABADO; domingo = DIA_DOMINGO;
  nuevaMateria = new Materia();
  nuevoHorario = new Horario();
  materias: Materia[] = [];
  horarios: Horario[] = [];
  nuevosHorarios: Horario[] = [];
  usuario = new User();
  mostrarListaMaterias = false;

  constructor(private datosEstudiante: EstudianteService, private alerta: AlertsService, private materiaService: MateriasService
    , private modalCtrl: ModalController, private alertController: AlertController) { }

  async ngOnInit() {
    this.mostrarListaMaterias = false;
    this.nuevoHorario.horaInicial = new Date();
    this.nuevoHorario.horaFinal = new Date();
    await this.mostrarListaButton();
    await this.datosEstudiante.obtenerEstudiante();
    this.usuario.identificacion = this.datosEstudiante.estudiante.identificacion;
    this.nuevaMateria.estudiante = this.usuario;
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

  async mostrarListaButton() {
    await this.datosEstudiante.obtenerMaterias();
    this.materias = this.datosEstudiante.materias;
    if (this.materias.length === 0) {
      this.mostrarListaMaterias = false;
      this.alerta.showToast(INFO_LISTA_VACIA.concat('Materias'), 'secondary');
    }
    else {
      this.mostrarListaMaterias = true;
    }
  }

  private validarDia(): boolean {
    if (!this.nuevoHorario.dia) {
      return true;
    }
    return false;
  }

  private validarNombre(): boolean {
    if (!this.nuevaMateria.nombreMateria) {
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

  private reiniciarHorario(horaInicial: Date, horaFinal: Date): Horario {
    this.nuevoHorario = new Horario();
    this.nuevoHorario.horaInicial = new Date(horaInicial);
    this.nuevoHorario.horaFinal = new Date(horaFinal);
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
      this.nuevosHorarios.push(this.nuevoHorario);
      const horaInicial = this.nuevoHorario.horaInicial;
      const horaFinal = this.nuevoHorario.horaFinal;
      this.reiniciarHorario(horaInicial, horaFinal);
      this.alerta.showToast(INFO_ADICION_HORARIO.concat(this.nuevaMateria.nombreMateria), 'secondary', 1000);
    }
  }

  async crearMateria() {
    if (this.validarNombre()) {
      this.alerta.presentAlert(MENSAJE_ERROR, ERROR_NOMBRE_MATERIA);
    }
    else if (this.nuevosHorarios.length <= 0) {
      this.alerta.presentAlert(MENSAJE_ERROR, ERROR_MATERIA_CANTIDAD_HORARIOS);
    }
    else {
      this.mostrarListaMaterias = false;
      this.nuevaMateria.horarios = this.nuevosHorarios;
      (await this.materiaService.createMateria(this.nuevaMateria)).
        subscribe(async () => {
          this.alerta.showToast(GUARDAR_MATERIA_EXITO, 'success');
          await this.datosEstudiante.getEstudiante(this.usuario);
          this.mostrarListaMaterias = false;
          this.nuevosHorarios = [];
          this.nuevaMateria = new Materia();
          setTimeout(async () => {
            await this.mostrarListaButton();
          }, 500);
        }, async error => {
          if (error.status === 400) {
            this.alerta.presentAlert(MENSAJE_ERROR, error.error);
          }
          else {
            this.alerta.presentAlert(MENSAJE_ERROR, GUARDAR_MATERIA_ERROR);
          }
          await this.ngOnInit();
        });
    }
  }

  async editarMateria(materia: Materia) {
    this.itemLista.closeSlidingItems();
    const modalUpdate = await this.modalCtrl.create({
      component: UpdateMateriaPage,
      componentProps: { viejaMateria: materia }
    });
    modalUpdate.onWillDismiss()
    .then(async () => {
      this.mostrarListaMaterias = false;
      setTimeout(async () => {
        await this.mostrarListaButton();
      }, 500);
    });
    await modalUpdate.present();
  }

  async eliminarMateria(materia: Materia) {
    this.itemLista.closeSlidingItems();
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: CONFIRMACION_BORRAR_MATERIA,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          handler: async () => {
            materia.estudiante = this.usuario;
            this.mostrarListaMaterias = false;
            (await this.materiaService.deleteMateria(materia))
              .subscribe(async () => {
                this.alerta.showToast(BORRADO_EXITOSO_MATERIA, 'secondary');
                await this.datosEstudiante.getEstudiante(this.usuario);
                this.mostrarListaMaterias = false;
                setTimeout(async () => {
                  await this.mostrarListaButton();
                }, 500);
              }, async error => {
                if (error.status === 400) {
                  this.alerta.presentAlert(MENSAJE_ERROR, error.error);
                }
                else {
                  this.alerta.presentAlert(MENSAJE_ERROR, BORRADO_FALLIDO_MATERIA);
                }
              });
          }
        }
      ]
    });
    await alert.present();
  }
}
