import { Component, OnInit } from '@angular/core';
import { Salida, User } from '../../models/interfaces';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { MOTIVO_ACADEMICO, MOTIVO_PERSONAL, MOTIVO_RECREATIVO, HORA_MAXIMA_SALIDA, HORA_MINIMA_SALIDA } from '../../models/constantes';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { MENSAJE_ERROR, GUARDAR_SALIDA_ERROR, GUARDAR_SALIDA_EXITO } from 'src/app/models/mensajes';
import { SalidasService } from 'src/app/services/salidas/salidas.service';
import { ERROR_FECHAS_PASADAS, ERROR_MOTIVO_LUGAR_FALTANTES, ERROR_HORAS_INVALIDAS, ERROR_FECHA_LLEGADA_MENOR_QUE_SALIDA,
  INFO_LISTA_VACIA } from '../../models/mensajes';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  salidas: Salida[] = [];
  nuevaSalida = new Salida();
  usuario = new User();
  fechaLlegada = new Date();
  fechaSalida = new Date();
  fechaComparacion = new Date();
  academico = MOTIVO_ACADEMICO;
  personal = MOTIVO_PERSONAL;
  recreativo = MOTIVO_RECREATIVO;
  mostrarLista = false;
  yearMinimo = this.fechaLlegada.getFullYear();

  constructor(private datosEstudiante: EstudianteService, private alerta: AlertsService
    , private salidaService: SalidasService) { }

  async ngOnInit() {
    await this.datosEstudiante.obtenerEstudiante();
    this.nuevaSalida.fechaSalida = new Date();
    this.nuevaSalida.fechaLlegada = new Date();
    await this.obtenerSalidas();
    this.usuario.identificacion = this.datosEstudiante.estudiante.identificacion;
    this.nuevaSalida.estudianteSalida = this.usuario;
  }

  private async obtenerSalidas() {
    await this.datosEstudiante.obtenerSalidas();
    this.salidas = this.datosEstudiante.salidas;
  }

  public mostrarListaButton() {
    this.obtenerSalidas();
    if (this.salidas.length === 0) {
      this.mostrarLista = false;
      this.alerta.showToast(INFO_LISTA_VACIA.concat('salidas'), 'secondary');
    }
    else {
      this.mostrarLista = !this.mostrarLista;
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
    if (this.nuevaSalida.fechaSalida.getMonth() < this.fechaComparacion.getMonth() ||
      this.nuevaSalida.fechaSalida.getDate() < this.fechaComparacion.getDate() ||
      this.nuevaSalida.fechaSalida.getHours() < this.fechaComparacion.getHours()
      && (this.nuevaSalida.fechaSalida.getDate() === this.fechaComparacion.getDate()
        && this.nuevaSalida.fechaSalida.getMonth() === this.fechaComparacion.getMonth())) {
      return true;
    }
    // verificar que no haya pasado la fechaLlegada
    else if (this.nuevaSalida.fechaLlegada.getMonth() < this.fechaComparacion.getMonth() ||
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

  public crearSalida() {
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
      console.log(this.nuevaSalida);
      this.salidaService.createSalida(this.nuevaSalida)
        .subscribe(async (data: string) => {
          this.alerta.showToast(GUARDAR_SALIDA_EXITO, 'success');
          this.datosEstudiante.getEstudiante(this.usuario);
          this.mostrarLista = false;
        }, async error => {
          this.alerta.presentAlert(MENSAJE_ERROR, GUARDAR_SALIDA_ERROR);
          console.log(error);
        });
    }
  }

}
