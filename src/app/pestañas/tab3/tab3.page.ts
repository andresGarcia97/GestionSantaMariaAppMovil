import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonList, ModalController, PickerController } from '@ionic/angular';
import { HORA_MAXIMA_RESERVA, HORA_MINIMA_RESERVA, MOTIVO_ACADEMICO, MOTIVO_PERSONAL, MOTIVO_RECREATIVO } from 'src/app/models/constantes';
import { BORRADO_EXITOSO_RESERVA, BORRADO_FALLIDO_RESERVA, CONFIRMACION_BORRAR_RESERVA, ERROR_MOTIVO_LUGAR_FALTANTES, MENSAJE_ERROR } from 'src/app/models/mensajes';
import { UpdateReservaPage } from 'src/app/pages/update-reserva/update-reserva.page';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { ReservasService } from 'src/app/services/reservas/reservas.service';
import { LUGAR_AUDITORIO, LUGAR_LAVANDERIA, LUGAR_SALA_INFORMATICA, LUGAR_SALA_TV, LUGAR_SALON3, LUGAR_SALON4, LUGAR_SALON_AMARILLO } from '../../models/constantes';
import { Reserva, User } from '../../models/interfaces';
import {
  ERROR_FECHAS_DIFERENTE_DIA, ERROR_FECHAS_INCUMPLEN_HORAS_RESERVA, ERROR_FECHA_INICIAL_MAYOR_QUE_FECHA_FINAL,
  ERROR_FECHA_INICIAL_PASADA, GUARDAR_RESERVA_ERROR, GUARDAR_RESERVA_EXITO, INFO_LISTA_VACIA_RESERVAS
} from '../../models/mensajes';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  @ViewChild('lista') itemLista: IonList;

  motivoYLugar = [
    [MOTIVO_PERSONAL, MOTIVO_ACADEMICO, MOTIVO_RECREATIVO, MOTIVO_PERSONAL, MOTIVO_ACADEMICO, MOTIVO_RECREATIVO, MOTIVO_ACADEMICO],
    [LUGAR_LAVANDERIA, LUGAR_AUDITORIO, LUGAR_SALA_TV, LUGAR_SALA_INFORMATICA, LUGAR_SALON_AMARILLO, LUGAR_SALON4, LUGAR_SALON3]
  ];

  lugar = ''; // muestra todas las reservas en el pipe
  reservas: Reserva[] = [];
  nuevaReserva = new Reserva();
  reservaConsultas = new Reserva();
  usuario = new User();
  fechaInicial = new Date();
  fechaFinal = new Date();
  fechaComparacion = new Date();
  mostrarLista = false;
  yearMinimo = this.fechaInicial.getFullYear();

  constructor(private alerta: AlertsService, private datosEstudiante: EstudianteService
    , private pickerController: PickerController, private reservasService: ReservasService
    , private modalCtrl: ModalController, private alertController: AlertController) { }

  async ngOnInit() {
    this.mostrarLista = false;
    this.nuevaReserva.fechaInicial = new Date();
    this.nuevaReserva.fechaFinal = new Date();
    this.reservaConsultas.fechaInicial = new Date();
    await this.reservasService.getReservas(this.reservaConsultas);
    await this.mostrarListaButton();
    await this.datosEstudiante.obtenerEstudiante();
    this.usuario.identificacion = this.datosEstudiante.estudiante.identificacion;
    this.nuevaReserva.usuario = this.usuario;
  }

  public async obtenerListaReservas(): Promise<Reserva[]> {
    await this.reservasService.ObtenerReservas();
    if (this.reservasService.reservas !== null) {
      this.reservas = this.reservasService.reservas;
    }
    return this.reservas;
  }

  public async mostrarListaButton() {
    await this.obtenerListaReservas();
    if (this.reservas.length === 0) {
      this.mostrarLista = false;
      this.alerta.showToast(INFO_LISTA_VACIA_RESERVAS, 'secondary');
    }
    else {
      this.mostrarLista = !this.mostrarLista;
    }
  }

  public cambioFechaInicial(event) {
    this.nuevaReserva.fechaInicial = new Date(event.detail.value);
  }
  public cambioFechaFinal(event) {
    this.nuevaReserva.fechaFinal = new Date(event.detail.value);
  }

  public async openPicker(numColumns: number, numOptions: number) {
    const picker = await this.pickerController.create({
      columns: this.getColumns(numColumns, numOptions, this.motivoYLugar),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          handler: (value) => {
            this.nuevaReserva.actividad = value['col-0'].text;
            this.nuevaReserva.espacio = value['col-1'].text;
          }
        }
      ]
    });
    await picker.present();
  }
  private getColumns(numColumns, numOptions, columnOptions) {
    const columns = [];
    for (let i = 0; i < numColumns; i++) {
      columns.push({
        name: `col-${i}`,
        options: this.getColumnOptions(i, numOptions, columnOptions)
      });
    }
    return columns;
  }
  private getColumnOptions(columnIndex, numOptions, columnOptions) {
    const options = [];
    for (let i = 0; i < numOptions; i++) {
      options.push({
        text: columnOptions[columnIndex][i % numOptions],
        value: i
      });
    }
    return options;
  }

  public segmentChanged(event) {
    const valorFiltro = event.detail.value;
    if (valorFiltro === '') {
      this.lugar = '';
    }
    else {
      this.lugar = valorFiltro;
    }
  }

  private validarCampos(): boolean {
    if (!this.nuevaReserva.actividad || !this.nuevaReserva.espacio) {
      return true;
    }
    return false;
  }
  private fechaInicialNoPasada(): boolean {
    if ((this.nuevaReserva.fechaInicial.getMonth() < this.fechaComparacion.getMonth() ||
      this.nuevaReserva.fechaInicial.getDate() < this.fechaComparacion.getDate() ||
      this.nuevaReserva.fechaInicial.getHours() < this.fechaComparacion.getHours() ||
      this.nuevaReserva.fechaInicial.getMinutes() < this.fechaComparacion.getMinutes()) &&
      (this.nuevaReserva.fechaInicial.getDate() === this.fechaComparacion.getDate() &&
        this.nuevaReserva.fechaInicial.getMonth() === this.fechaComparacion.getMonth())) {
      return true;
    }
    return false;
  }

  private fechaInicialMayor_quefechaFinal(): boolean {
    if (this.nuevaReserva.fechaFinal.getMonth() < this.nuevaReserva.fechaInicial.getMonth() ||
      this.nuevaReserva.fechaFinal.getDate() < this.nuevaReserva.fechaInicial.getDate() ||
      this.nuevaReserva.fechaFinal.getHours() < this.nuevaReserva.fechaInicial.getHours() ||
      (this.nuevaReserva.fechaFinal.getHours() === this.nuevaReserva.fechaInicial.getHours() &&
        this.nuevaReserva.fechaFinal.getMinutes() < this.nuevaReserva.fechaInicial.getMinutes())) {
      return true;
    }
    return false;
  }

  private mismoDiaYMes(): boolean {
    if (this.nuevaReserva.fechaFinal.getMonth() === this.nuevaReserva.fechaInicial.getMonth() &&
      this.nuevaReserva.fechaFinal.getDate() === this.nuevaReserva.fechaInicial.getDate()) {
      return true;
    }
    return false;
  }

  private validarLogicaFechas(): boolean {
    if (this.nuevaReserva.fechaFinal.getHours() >= HORA_MAXIMA_RESERVA ||
      this.nuevaReserva.fechaInicial.getHours() >= HORA_MAXIMA_RESERVA ||
      this.nuevaReserva.fechaFinal.getHours() <= HORA_MINIMA_RESERVA ||
      this.nuevaReserva.fechaInicial.getHours() <= HORA_MINIMA_RESERVA) {
      return true;
    }
    return false;
  }

  public crearReserva() {
    if (this.validarCampos()) {
      this.alerta.presentAlert(MENSAJE_ERROR, ERROR_MOTIVO_LUGAR_FALTANTES);
    }
    else if (this.fechaInicialNoPasada()) {
      this.alerta.presentAlert(MENSAJE_ERROR, ERROR_FECHA_INICIAL_PASADA);
    }
    else if (this.fechaInicialMayor_quefechaFinal()) {
      this.alerta.presentAlert(MENSAJE_ERROR, ERROR_FECHA_INICIAL_MAYOR_QUE_FECHA_FINAL);
    }
    else if (!this.mismoDiaYMes()) {
      this.alerta.presentAlert(MENSAJE_ERROR, ERROR_FECHAS_DIFERENTE_DIA);
    }
    else if (this.validarLogicaFechas()) {
      this.alerta.presentAlert(MENSAJE_ERROR, ERROR_FECHAS_INCUMPLEN_HORAS_RESERVA);
    }
    else {
      console.log(this.nuevaReserva);
      this.mostrarLista = false;
      this.reservasService.saveReserva(this.nuevaReserva)
        .subscribe(async (data: string) => {
          this.alerta.showToast(GUARDAR_RESERVA_EXITO, 'success');
          this.reservas = [];
        }, async error => {
          if (error.status === 400) {
            this.alerta.presentAlert(MENSAJE_ERROR, error.error);
          }
          else {
            this.alerta.presentAlert(MENSAJE_ERROR, GUARDAR_RESERVA_ERROR);
          }
          console.log(error);
        });
    }
  }

  public async editarReserva(reserva: Reserva) {
    this.itemLista.closeSlidingItems();
    this.mostrarLista = false;
    const modalUpdate = await this.modalCtrl.create({
      component: UpdateReservaPage,
      componentProps: {
        viejaReserva: reserva
      }
    });
    await modalUpdate.present();
    console.log(reserva);
  }
  async eliminarReserva(reserva: Reserva) {
    this.itemLista.closeSlidingItems();
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: CONFIRMACION_BORRAR_RESERVA,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.reservasService.deleteReserva(reserva)
              .subscribe(async (data: string) => {
                this.alerta.showToast(BORRADO_EXITOSO_RESERVA, 'secondary');
              }, async error => {
                if (error.status === 400) {
                  this.alerta.presentAlert(MENSAJE_ERROR, error.error);
                }
                else {
                  this.alerta.presentAlert(MENSAJE_ERROR, BORRADO_FALLIDO_RESERVA);
                }
                console.log(error);
              });
          }
        }
      ]
    });
    await alert.present();
  }

  async actualizarContenido(event) {
    setTimeout(async () => {
      await this.ngOnInit();
      event.target.complete();
    }, 2000);
  }
}
