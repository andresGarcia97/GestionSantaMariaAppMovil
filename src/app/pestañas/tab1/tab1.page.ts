import { Component, OnInit } from '@angular/core';
import { GUARDAR_SALIDA_ERROR, GUARDAR_SALIDA_EXITO, MENSAJE_ERROR } from 'src/app/models/mensajes';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { SalidasService } from 'src/app/services/salidas/salidas.service';
import { HORA_MAXIMA_SALIDA, HORA_MINIMA_SALIDA, MOTIVO_ACADEMICO, MOTIVO_PERSONAL, MOTIVO_RECREATIVO } from '../../models/constantes';
import { Salida, User } from '../../models/interfaces';
import {
  ERROR_FECHAS_PASADAS, ERROR_FECHA_LLEGADA_MENOR_QUE_SALIDA, ERROR_HORAS_INVALIDAS, ERROR_MOTIVO_LUGAR_FALTANTES,
  INFO_LISTA_VACIA
} from '../../models/mensajes';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  salidas: Salida[] = [];
  mostrarLista = false;
  nuevaSalida = new Salida();
  usuario = new User();
  fechaLlegada = new Date();
  fechaSalida = new Date();
  fechaComparacion = new Date();
  academico = MOTIVO_ACADEMICO;
  personal = MOTIVO_PERSONAL;
  recreativo = MOTIVO_RECREATIVO;
  yearMinimo = this.fechaLlegada.getFullYear();

  constructor(private datosEstudiante: EstudianteService, private alerta: AlertsService
    , private salidaService: SalidasService) { }

  async ngOnInit() {
    this.mostrarLista = false;
    this.nuevaSalida.fechaSalida = new Date();
    this.nuevaSalida.fechaLlegada = new Date();
    setTimeout(async () => {
      await this.mostrarListaButton();
      await this.datosEstudiante.obtenerEstudiante();
      this.usuario.identificacion = this.datosEstudiante.estudiante.identificacion;
      this.nuevaSalida.estudianteSalida = this.usuario;
    }, 500);
  }

  public async mostrarListaButton() {
    await this.datosEstudiante.obtenerSalidas();
    if (this.datosEstudiante.salidas !== null && this.datosEstudiante.salidas.length > 0) {
      this.salidas = this.datosEstudiante.salidas;
      this.mostrarLista = true;
    }
    else {
      this.mostrarLista = false;
      this.alerta.showToast(INFO_LISTA_VACIA.concat('salidas'), 'secondary');
    }
  }

  public obtenerMotivo(event) {
    this.nuevaSalida.razon = event.detail.value;
  }

  public cambioFechaLlegada(event) {
    this.nuevaSalida.fechaLlegada = new Date(event.detail.value);
  }

  public cambioFechaSalida(event) {
    this.nuevaSalida.fechaSalida = new Date(event.detail.value);
  }

  private validarMotivo_Lugar(): boolean {
    if (!this.nuevaSalida.lugar || !this.nuevaSalida.razon) {
      return true;
    }
    return false;
  }

  private validarLogicaFechas(): boolean {
    if (this.nuevaSalida.fechaSalida.getHours() >= HORA_MAXIMA_SALIDA ||
      this.nuevaSalida.fechaLlegada.getHours() >= HORA_MAXIMA_SALIDA ||
      this.nuevaSalida.fechaSalida.getHours() <= HORA_MINIMA_SALIDA ||
      this.nuevaSalida.fechaLlegada.getHours() <= HORA_MINIMA_SALIDA) {
      return true;
    }
    return false;
  }

  private validarFechas(): boolean {
    // verifica que no haya pasado la fechaSalida
    if (((this.nuevaSalida.fechaSalida.getDate() === this.fechaComparacion.getDate() &&
      this.nuevaSalida.fechaSalida.getMonth() === this.fechaComparacion.getMonth()) &&
      this.nuevaSalida.fechaSalida.getHours() < this.fechaComparacion.getHours()) ||
      (this.nuevaSalida.fechaSalida.getMonth() < this.fechaComparacion.getMonth() &&
        this.nuevaSalida.fechaSalida.getDate() < this.fechaComparacion.getDate())) {
      return true;
    }
    // verificar que no haya pasado la fechaLlegada
    else if (this.nuevaSalida.fechaLlegada.getMonth() < this.fechaComparacion.getMonth() &&
      this.nuevaSalida.fechaLlegada.getDate() < this.fechaComparacion.getDate()) {
      return true;
    }
    return false;
  }

  private fechaSalidaMayor_fechaLlegada(): boolean {
    if ((this.nuevaSalida.fechaLlegada.getMonth() <= this.nuevaSalida.fechaSalida.getMonth()) &&
      (this.nuevaSalida.fechaLlegada.getDate() <= this.nuevaSalida.fechaSalida.getDate()) &&
      this.nuevaSalida.fechaLlegada.getHours() <= this.nuevaSalida.fechaSalida.getHours()) {
      return true;
    }
    return false;
  }

  public async crearSalida() {
    console.log(this.nuevaSalida);
    if (this.validarMotivo_Lugar()) {
      this.alerta.presentAlert(MENSAJE_ERROR, ERROR_MOTIVO_LUGAR_FALTANTES);
    }
    else if (this.validarFechas()) {
      this.alerta.presentAlert(MENSAJE_ERROR, ERROR_FECHAS_PASADAS);
    }
    else if (this.validarLogicaFechas()) {
      this.alerta.presentAlert(MENSAJE_ERROR, ERROR_HORAS_INVALIDAS);
    }
    else if (this.fechaSalidaMayor_fechaLlegada()) {
      this.alerta.presentAlert(MENSAJE_ERROR, ERROR_FECHA_LLEGADA_MENOR_QUE_SALIDA);
    }
    else {
      (await this.salidaService.createSalida(this.nuevaSalida))
        .subscribe(() => {
          this.alerta.showToast(GUARDAR_SALIDA_EXITO, 'success');
          this.datosEstudiante.getEstudiante(this.usuario);
          this.mostrarLista = false;
          setTimeout(async () => {
            await this.mostrarListaButton();
          }, 500);
        }, async () => {
          this.alerta.presentAlert(MENSAJE_ERROR, GUARDAR_SALIDA_ERROR);
        });
    }
  }

}
