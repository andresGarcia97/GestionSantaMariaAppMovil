import { Component, OnInit } from '@angular/core';
import { GUARDAR_SALIDA_ERROR, GUARDAR_SALIDA_EXITO, INFO_TODAVIA_NO_TIENE_FIRMA, LOGOUT_FORZADO, MENSAJE_ERROR } from 'src/app/models/mensajes';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { LoginService } from 'src/app/services/login/login.service';
import { SalidasService } from 'src/app/services/salidas/salidas.service';
import { HORA_MAXIMA_SALIDA, HORA_MINIMA_SALIDA, MOTIVO_ACADEMICO, MOTIVO_MEDICO, MOTIVO_PERSONAL, MOTIVO_RECREATIVO } from '../../models/constantes';
import { Salida, User } from '../../models/interfaces';
import {
  ERROR_FECHAS_PASADAS, ERROR_FECHA_LLEGADA_MENOR_QUE_SALIDA, ERROR_HORAS_INVALIDAS, ERROR_MOTIVO_LUGAR_FALTANTES,
  INFO_LISTA_VACIA
} from '../../models/mensajes';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html'
})
export class Tab1Page implements OnInit {

  protected salidas: Salida[] = [];
  protected mostrarLista = false;
  protected nuevaSalida = new Salida();
  private usuario = new User();
  protected fechaLlegada = new Date();
  protected fechaSalida = new Date();
  private fechaComparacion = new Date();
  protected academico = MOTIVO_ACADEMICO;
  protected personal = MOTIVO_PERSONAL;
  protected recreativo = MOTIVO_RECREATIVO;
  protected medico = MOTIVO_MEDICO;
  protected yearMinimo = this.fechaLlegada.getFullYear();
  protected botonEnviar = false;

  constructor(private datosEstudiante: EstudianteService, private alerts: AlertsService
    , private salidaService: SalidasService, private logoutForced: LoginService) { }

  public async ngOnInit() {
    this.botonEnviar = false;
    this.mostrarLista = false;
    this.nuevaSalida.fechaSalida = new Date();
    this.nuevaSalida.fechaLlegada = new Date();
    setTimeout(async () => {
      await this.mostrarListaButton();
      await this.datosEstudiante.obtenerEstudiante();
      this.usuario.identificacion = this.datosEstudiante.estudiante.identificacion;
      this.nuevaSalida.estudianteSalida = this.usuario;
    }, 300);
  }

  public async mostrarListaButton() {
    await this.datosEstudiante.obtenerSalidas();
    if (this.datosEstudiante.salidas !== null && this.datosEstudiante.salidas.length > 0) {
      this.salidas = this.datosEstudiante.salidas;
      this.mostrarLista = true;
    }
    else {
      this.mostrarLista = false;
      this.alerts.showToast(INFO_LISTA_VACIA.concat('salidas'), 'secondary');
    }
  }

  public obtenerMotivo(event: any) {
    this.nuevaSalida.razon = event.detail.value;
  }

  public cambioFechaLlegada(event: any) {
    this.nuevaSalida.fechaLlegada = new Date(event.detail.value);
  }

  public cambioFechaSalida(event: any) {
    this.nuevaSalida.fechaSalida = new Date(event.detail.value);
  }

  private async validarFirma(): Promise<boolean> {
    await this.datosEstudiante.obtenerFirma();
    const firma = this.datosEstudiante.firma;
    if (!firma || 0 === firma.length) {
      return true;
    }
    return false;
  }

  private validarMotivo_Lugar(): boolean {
    if (!this.nuevaSalida.lugar || !this.nuevaSalida.razon) {
      return true;
    }
    return false;
  }

  private validarLogicaFechas(): boolean {
    if (this.nuevaSalida.fechaSalida.getHours() >= HORA_MAXIMA_SALIDA ||
      this.nuevaSalida.fechaLlegada.getHours() > HORA_MAXIMA_SALIDA ||
      this.nuevaSalida.fechaSalida.getHours() < HORA_MINIMA_SALIDA ||
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
    const firma = await this.validarFirma();
    this.fechaComparacion = new Date();
    if (this.validarMotivo_Lugar()) {
      this.alerts.presentAlert(MENSAJE_ERROR, ERROR_MOTIVO_LUGAR_FALTANTES);
    }
    else if (this.validarFechas()) {
      this.alerts.presentAlert(MENSAJE_ERROR, ERROR_FECHAS_PASADAS);
    }
    else if (this.validarLogicaFechas()) {
      this.alerts.presentAlert(MENSAJE_ERROR, ERROR_HORAS_INVALIDAS);
    }
    else if (this.fechaSalidaMayor_fechaLlegada()) {
      this.alerts.presentAlert(MENSAJE_ERROR, ERROR_FECHA_LLEGADA_MENOR_QUE_SALIDA);
    }
    else if (firma) {
      this.alerts.presentAlert(MENSAJE_ERROR, INFO_TODAVIA_NO_TIENE_FIRMA);
    }
    else {
      this.botonEnviar = true;
      (await this.salidaService.createSalida(this.nuevaSalida))
        .subscribe(async () => {
          this.alerts.showToast(GUARDAR_SALIDA_EXITO, 'success');
          await this.datosEstudiante.getEstudiante(this.usuario);
          this.mostrarLista = false;
          setTimeout(async () => {
            await this.ngOnInit();
          }, 100);
          this.botonEnviar = false;
        }, error => {
          if (error.status === 401) {
            this.alerts.presentAlert(MENSAJE_ERROR, LOGOUT_FORZADO);
            this.logoutForced.logout();
          }
          else {
            this.alerts.presentAlert(MENSAJE_ERROR, GUARDAR_SALIDA_ERROR);
          }
          this.botonEnviar = false;
        });
    }
  }

}
