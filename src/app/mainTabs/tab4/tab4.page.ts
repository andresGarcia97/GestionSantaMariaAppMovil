import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonList, ModalController } from '@ionic/angular';
import { INFO_LISTA_VACIA, LOGOUT_FORZADO, MENSAJE_ERROR } from 'src/app/models/mensajes';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { LoginService } from 'src/app/services/login/login.service';
import {
  DIA_DOMINGO, DIA_JUEVES, DIA_LUNES, DIA_MARTES, DIA_MIERCOLES, DIA_SABADO, DIA_VIERNES,
  HORA_MAXIMA_FIN_MATERIA,
  HORA_MINIMA_INICIO_MATERIA as HORA_MINIMA_INICIO_MATERIA
} from '../../models/constantes';
import { Horario, Materia, User } from '../../models/interfaces';
import {
  BORRADO_EXITOSO_MATERIA, BORRADO_FALLIDO_MATERIA, CONFIRMACION_BORRAR_MATERIA, ERROR_DIA_VACIO,
  ERROR_HORAS_INVALIDAS, ERROR_HORA_INICIAL_MAYOR_QUE_HORA_FINAL,
  ERROR_MATERIA_CANTIDAD_HORARIOS, ERROR_NOMBRE_MATERIA, GUARDAR_MATERIA_ERROR, GUARDAR_MATERIA_EXITO, INFO_ADICION_HORARIO
} from '../../models/mensajes';
import { UpdateMateriaPage } from '../../pages/update-materia/update-materia.page';
import { MateriasService } from '../../services/materias/materias.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html'
})
export class Tab4Page implements OnInit {

  @ViewChild('lista') itemLista: IonList;

  protected lunes = DIA_LUNES; martes = DIA_MARTES; miercoles = DIA_MIERCOLES;
  protected jueves = DIA_JUEVES; viernes = DIA_VIERNES; sabado = DIA_SABADO; domingo = DIA_DOMINGO;
  protected nuevaMateria = new Materia();
  protected nuevoHorario = new Horario();
  protected materias: Materia[] = [];
  protected horarios: Horario[] = [];
  protected nuevosHorarios: Horario[] = [];
  protected usuario = new User();
  protected mostrarListaMaterias = false;
  protected botonEnviar = false;

  constructor(private datosEstudiante: EstudianteService, private alerts: AlertsService, private materiaService: MateriasService
    , private modalCtrl: ModalController, private alertController: AlertController, private logoutForced: LoginService) { }

  async ngOnInit() {
    this.botonEnviar = false;
    this.mostrarListaMaterias = false;
    this.nuevoHorario.horaInicial = new Date();
    this.nuevoHorario.horaFinal = new Date();
    await this.mostrarListaButton();
    await this.datosEstudiante.obtenerEstudiante();
    this.usuario.identificacion = this.datosEstudiante.estudiante.identificacion;
    this.nuevaMateria.estudiante = this.usuario;
  }

  cambioHoraInicial(event: any) {
    this.nuevoHorario.horaInicial = new Date(event.detail.value);
  }
  cambioHoraFinal(event: any) {
    this.nuevoHorario.horaFinal = new Date(event.detail.value);
  }
  obtenerDia(event: any) {
    this.nuevoHorario.dia = event.detail.value;
  }

  async mostrarListaButton() {
    await this.datosEstudiante.obtenerMaterias();
    this.materias = this.datosEstudiante.materias;
    if (this.materias.length === 0) {
      this.mostrarListaMaterias = false;
      this.alerts.showToast(INFO_LISTA_VACIA.concat('Materias'), 'secondary');
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
    if (this.nuevoHorario.horaFinal.getHours() > HORA_MAXIMA_FIN_MATERIA ||
      this.nuevoHorario.horaInicial.getHours() >= HORA_MAXIMA_FIN_MATERIA ||
      this.nuevoHorario.horaFinal.getHours() <= HORA_MINIMA_INICIO_MATERIA ||
      this.nuevoHorario.horaInicial.getHours() < HORA_MINIMA_INICIO_MATERIA) {
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
      this.alerts.presentAlert(MENSAJE_ERROR, ERROR_NOMBRE_MATERIA);
    }
    else if (this.validarDia()) {
      this.alerts.presentAlert(MENSAJE_ERROR, ERROR_DIA_VACIO);
    }
    else if (this.validarHoras()) {
      this.alerts.presentAlert(MENSAJE_ERROR, ERROR_HORAS_INVALIDAS);
    }
    else if (this.validarHoraFinalMayor()) {
      this.alerts.presentAlert(MENSAJE_ERROR, ERROR_HORA_INICIAL_MAYOR_QUE_HORA_FINAL);
    }
    else {
      this.nuevosHorarios.push(this.nuevoHorario);
      const horaInicial = this.nuevoHorario.horaInicial;
      const horaFinal = this.nuevoHorario.horaFinal;
      this.reiniciarHorario(horaInicial, horaFinal);
      this.alerts.showToast(INFO_ADICION_HORARIO.concat(this.nuevaMateria.nombreMateria), 'secondary', 1000);
    }
  }

  async crearMateria() {
    if (this.validarNombre()) {
      this.alerts.presentAlert(MENSAJE_ERROR, ERROR_NOMBRE_MATERIA);
    }
    else if (this.nuevosHorarios.length <= 0) {
      this.alerts.presentAlert(MENSAJE_ERROR, ERROR_MATERIA_CANTIDAD_HORARIOS);
    }
    else {
      this.botonEnviar = true;
      this.nuevaMateria.horarios = this.nuevosHorarios;
      (await this.materiaService.createMateria(this.nuevaMateria)).
        subscribe(async () => {
          this.alerts.showToast(GUARDAR_MATERIA_EXITO, 'success');
          await this.datosEstudiante.getEstudiante(this.usuario);
          this.mostrarListaMaterias = false;
          this.nuevosHorarios = [];
          this.nuevaMateria = new Materia();
          setTimeout(async () => {
            await this.mostrarListaButton();
          }, 300);
          this.botonEnviar = false;
        }, error => {
          if (error.status === 400) {
            this.alerts.presentAlert(MENSAJE_ERROR, error.error);
          }
          else if (error.status === 401) {
            this.logoutForzado();
          }
          else {
            this.alerts.presentAlert(MENSAJE_ERROR, GUARDAR_MATERIA_ERROR);
          }
          this.botonEnviar = false;
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
        }, 400);
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
            (await this.materiaService.deleteMateria(materia))
              .subscribe(async () => {
                this.alerts.showToast(BORRADO_EXITOSO_MATERIA, 'secondary');
                await this.datosEstudiante.getEstudiante(this.usuario);
                this.mostrarListaMaterias = false;
                setTimeout(async () => {
                  await this.mostrarListaButton();
                }, 400);
              }, error => {
                if (error.status === 400) {
                  this.alerts.presentAlert(MENSAJE_ERROR, error.error);
                }
                else if (error.status === 401) {
                  this.logoutForzado();
                }
                else {
                  this.alerts.presentAlert(MENSAJE_ERROR, BORRADO_FALLIDO_MATERIA);
                }
              });
          }
        }
      ]
    });
    await alert.present();
  }

  private logoutForzado() {
    this.alerts.presentAlert(MENSAJE_ERROR, LOGOUT_FORZADO);
    this.logoutForced.logout();
  }
}
