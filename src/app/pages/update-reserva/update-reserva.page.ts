import { Component, Input, OnInit } from '@angular/core';
import { ModalController, PickerController } from '@ionic/angular';
import { HORA_MAXIMA_RESERVA, HORA_MINIMA_RESERVA, MOTIVO_ACADEMICO, MOTIVO_PERSONAL, MOTIVO_RECREATIVO } from 'src/app/models/constantes';
import { Reserva } from 'src/app/models/interfaces';
import {
  ERROR_FECHAS_DIFERENTE_DIA, ERROR_FECHAS_INCUMPLEN_HORAS_RESERVA, ERROR_FECHA_INICIAL_MAYOR_QUE_FECHA_FINAL,
  ERROR_FECHA_INICIAL_PASADA, MENSAJE_ERROR
} from 'src/app/models/mensajes';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { ReservasService } from 'src/app/services/reservas/reservas.service';
import { LUGAR_AUDITORIO, LUGAR_LAVANDERIA, LUGAR_SALA_INFORMATICA, LUGAR_SALA_TV, LUGAR_SALON3, LUGAR_SALON4, LUGAR_SALON_AMARILLO } from '../../models/constantes';

@Component({
  selector: 'app-update-reserva',
  templateUrl: './update-reserva.page.html',
  styleUrls: ['./update-reserva.page.scss'],
})
export class UpdateReservaPage implements OnInit {

  @Input() viejaReserva: Reserva;

  motivoYLugar = [
    [MOTIVO_PERSONAL, MOTIVO_ACADEMICO, MOTIVO_RECREATIVO, MOTIVO_PERSONAL, MOTIVO_ACADEMICO, MOTIVO_RECREATIVO, MOTIVO_ACADEMICO],
    [LUGAR_LAVANDERIA, LUGAR_AUDITORIO, LUGAR_SALA_TV, LUGAR_SALA_INFORMATICA, LUGAR_SALON_AMARILLO, LUGAR_SALON4, LUGAR_SALON3]
  ];

  fechaInicial = new Date();
  fechaFinal = new Date();
  fechaComparacion = new Date();
  yearMinimo = this.fechaInicial.getFullYear();
  actualizacionReserva = new Reserva();
  reservas: Reserva[] = [];
  constructor(private modalCtrl: ModalController, private pickerController: PickerController
    , private alerta: AlertsService, private reservasService: ReservasService) { }

  ngOnInit() {
    this.actualizacionReserva.fechaInicial = new Date();
    this.actualizacionReserva.fechaFinal = new Date();
    this.actualizacionReserva.actividad = this.viejaReserva.actividad;
    this.actualizacionReserva.espacio = this.viejaReserva.espacio;
    this.actualizacionReserva.usuario = this.viejaReserva.usuario;
    console.log(this.actualizacionReserva);
  }

  public cambioFechaInicial(event) {
    this.actualizacionReserva.fechaInicial = new Date(event.detail.value);
  }
  public cambioFechaFinal(event) {
    this.actualizacionReserva.fechaFinal = new Date(event.detail.value);
  }

  private fechaInicialNoPasada(): boolean {
    if ((this.actualizacionReserva.fechaInicial.getMonth() < this.fechaComparacion.getMonth() ||
      this.actualizacionReserva.fechaInicial.getDate() < this.fechaComparacion.getDate() ||
      this.actualizacionReserva.fechaInicial.getHours() < this.fechaComparacion.getHours() ||
      this.actualizacionReserva.fechaInicial.getMinutes() < this.fechaComparacion.getMinutes()) &&
      (this.actualizacionReserva.fechaInicial.getDate() === this.fechaComparacion.getDate() &&
        this.actualizacionReserva.fechaInicial.getMonth() === this.fechaComparacion.getMonth())) {
      return true;
    }
    return false;
  }

  private fechaInicialMayor_quefechaFinal(): boolean {
    if (this.actualizacionReserva.fechaFinal.getMonth() < this.actualizacionReserva.fechaInicial.getMonth() ||
      this.actualizacionReserva.fechaFinal.getDate() < this.actualizacionReserva.fechaInicial.getDate() ||
      this.actualizacionReserva.fechaFinal.getHours() < this.actualizacionReserva.fechaInicial.getHours() ||
      (this.actualizacionReserva.fechaFinal.getHours() === this.actualizacionReserva.fechaInicial.getHours() &&
        this.actualizacionReserva.fechaFinal.getMinutes() < this.actualizacionReserva.fechaInicial.getMinutes())) {
      return true;
    }
    return false;
  }

  private mismoDiaYMes(): boolean {
    if (this.actualizacionReserva.fechaFinal.getMonth() === this.actualizacionReserva.fechaInicial.getMonth() &&
      this.actualizacionReserva.fechaFinal.getDate() === this.actualizacionReserva.fechaInicial.getDate()) {
      return true;
    }
    return false;
  }

  private validarLogicaFechas(): boolean {
    if (this.actualizacionReserva.fechaFinal.getHours() >= HORA_MAXIMA_RESERVA ||
      this.actualizacionReserva.fechaInicial.getHours() >= HORA_MAXIMA_RESERVA ||
      this.actualizacionReserva.fechaFinal.getHours() <= HORA_MINIMA_RESERVA ||
      this.actualizacionReserva.fechaInicial.getHours() <= HORA_MINIMA_RESERVA) {
      return true;
    }
    return false;
  }

  public aceptarUpdate() {
    this.reservas = [];
    if (this.fechaInicialNoPasada()) {
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
      this.reservas.push(this.viejaReserva);
      this.reservas.push(this.actualizacionReserva);
      console.log(this.reservas);
      this.reservasService.updateReserva(this.reservas)
        .subscribe(async (data: string) => {
          this.reservasService.getReservas(this.actualizacionReserva);
          this.alerta.showToast('actualizar exitoso', 'success');
        }, async error => {
          if (error.status === 400) {
            this.alerta.presentAlert(MENSAJE_ERROR, error.error);
          }
          else {
            this.alerta.presentAlert(MENSAJE_ERROR, 'error faltal');
          }
          console.log(error);
        });
      this.modalCtrl.dismiss();
    }
  }

  cancelarUpdate() {
    this.alerta.showToast('actualización cancelada', 'secondary');
    this.modalCtrl.dismiss();
  }

}
