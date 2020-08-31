import { Component, OnInit } from '@angular/core';
import { PickerController } from '@ionic/angular';
import { ERROR_HORA_INASITENCIA, GUARDAR_INASISTENCIA_ERROR, GUARDAR_INASISTENCIA_EXITO, MENSAJE_ERROR } from 'src/app/models/mensajes';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import {
  HORA_ALMUERZO, HORA_CENA, HORA_DESAYUNO, MOMENTO_ALMUERZO, MOMENTO_CENA,
  MOMENTO_DESAYUNO, MOTIVO_ACADEMICO, MOTIVO_PERSONAL, MOTIVO_RECREATIVO
} from '../../models/constantes';
import { InasistenciaAlimentacion, User } from '../../models/interfaces';
import { ERROR_FECHA_PASADA, ERROR_MOTIVO_HORA_FALTANTES, INFO_LISTA_VACIA } from '../../models/mensajes';
import { InasistenciaService } from '../../services/inasistencias/inasistencia.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  motivoYHora = [
    [MOTIVO_PERSONAL, MOTIVO_ACADEMICO, MOTIVO_RECREATIVO],
    [MOMENTO_DESAYUNO, MOMENTO_ALMUERZO, MOMENTO_CENA]
  ];

  public saveInasistencias: InasistenciaAlimentacion[] = [];
  public InasistenciasUsuario: InasistenciaAlimentacion[] = [];
  public fechaInasistencia = new Date();
  public yearMInimo = this.fechaInasistencia.getFullYear();
  public mesMInimo = this.fechaInasistencia.getMonth();
  public diaMinimo = this.fechaInasistencia.getDate();
  public inasistencia = new InasistenciaAlimentacion();
  public mostrarLista = false;
  public usuario = new User();

  constructor(private pickerController: PickerController, private alerta: AlertsService,
    private inasitenciaService: InasistenciaService, private datosEstudiante: EstudianteService) { }

  async ngOnInit() {
    this.mostrarLista = false;
    await this.mostrarListaButton();
    this.inasistencia.fecha = new Date();
    await this.datosEstudiante.obtenerEstudiante();
    this.usuario.identificacion = this.datosEstudiante.estudiante.identificacion;
    this.inasistencia.estudianteInasistencia = this.usuario;
  }

  public async mostrarListaButton() {
    await this.datosEstudiante.obtenerInasistencias();
    if (this.datosEstudiante.inasistencias !== null && this.datosEstudiante.inasistencias.length > 0) {
      this.InasistenciasUsuario = this.datosEstudiante.inasistencias;
      this.mostrarLista = true;
    }
    else {
      this.mostrarLista = false;
      this.alerta.showToast(INFO_LISTA_VACIA.concat('inasistencias'), 'secondary');
    }
  }

  public cambioFecha(event) {
    this.inasistencia.fecha = new Date(event.detail.value);
  }

  private validarFecha(): boolean {
    if (this.inasistencia.fecha.getMonth() < this.mesMInimo ||
      (this.inasistencia.fecha.getDate() < this.diaMinimo && this.inasistencia.fecha.getMonth() <= this.mesMInimo)) {
      this.inasistencia.fecha = this.fechaInasistencia;
      return true;
    }
    return false;
  }

  private validarCampos(): boolean {
    if (!this.inasistencia.motivo || !this.inasistencia.horaAlimentacion) {
      return true;
    }
    return false;
  }

  private validarHoras(): boolean {
    if ((((HORA_DESAYUNO - this.inasistencia.fecha.getHours()) <= 1 && this.inasistencia.horaAlimentacion.includes(MOMENTO_DESAYUNO)) ||
      ((HORA_ALMUERZO - this.inasistencia.fecha.getHours()) <= 1 && this.inasistencia.horaAlimentacion.includes(MOMENTO_ALMUERZO)) ||
      ((HORA_CENA - this.inasistencia.fecha.getHours()) <= 1 && this.inasistencia.horaAlimentacion.includes(MOMENTO_CENA)))
      && this.inasistencia.fecha.getDate() === this.diaMinimo && this.inasistencia.fecha.getMonth() === this.mesMInimo) {
      return true;
    }
    return false;
  }

  public async openPicker(numColumns: number, numOptions: number) {
    const picker = await this.pickerController.create({
      columns: this.getColumns(numColumns, numOptions, this.motivoYHora),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          handler: (value) => {
            this.inasistencia.motivo = value['col-0'].text;
            this.inasistencia.horaAlimentacion = value['col-1'].text;
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

  private reiniciarInasistencia(fecha: Date): InasistenciaAlimentacion {
    this.inasistencia = new InasistenciaAlimentacion();
    this.inasistencia.fecha = new Date(fecha);
    this.inasistencia.estudianteInasistencia = this.usuario;
    return this.inasistencia;
  }

  public async crearInansistencia() {
    if (this.validarFecha()) {
      this.alerta.presentAlert(MENSAJE_ERROR, ERROR_FECHA_PASADA);
    }
    else if (this.validarCampos()) {
      this.alerta.presentAlert(MENSAJE_ERROR, ERROR_MOTIVO_HORA_FALTANTES);
    }
    else if (this.validarHoras()) {
      this.alerta.presentAlert(MENSAJE_ERROR, ERROR_HORA_INASITENCIA.concat(this.inasistencia.horaAlimentacion));
    }
    else {
      this.saveInasistencias = [];
      this.saveInasistencias.push(this.inasistencia);
      const fecha = this.inasistencia.fecha;
      this.reiniciarInasistencia(fecha);
      (await this.inasitenciaService.createInasistencia(this.saveInasistencias))
        .subscribe(async () => {
          this.alerta.showToast(GUARDAR_INASISTENCIA_EXITO, 'success');
          await this.datosEstudiante.getEstudiante(this.usuario);
          this.mostrarLista = false;
          setTimeout(async () => {
            await this.mostrarListaButton();
          }, 500);
        }, async error => {
          if (error.status === 400) {
            this.alerta.presentAlert(MENSAJE_ERROR, error.error);
          }
          else {
            this.alerta.presentAlert(MENSAJE_ERROR, GUARDAR_INASISTENCIA_ERROR);
          }
        });
    }
  }

}
