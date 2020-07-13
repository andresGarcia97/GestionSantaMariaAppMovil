import { Component, OnInit } from '@angular/core';
import { InasistenciaAlimentacion, User } from '../../models/interfaces';
import { PickerController } from '@ionic/angular';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { MENSAJE_ERROR, GUARDAR_INASISTENCIA_EXITO, GUARDAR_INASISTENCIA_ERROR, ERROR_HORA_INASITENCIA } from 'src/app/models/mensajes';
import { InasistenciaService } from '../../services/inasistencias/inasistencia.service';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { ERROR_FECHA_PASADA, ERROR_MOTIVO_HORA_FALTANTES, INFO_LISTA_VACIA } from '../../models/mensajes';
import {
  HORA_DESAYUNO, HORA_ALMUERZO, HORA_CENA, MOTIVO_PERSONAL, MOMENTO_DESAYUNO, MOMENTO_ALMUERZO,
  MOMENTO_CENA, MOTIVO_ACADEMICO, MOTIVO_RECREATIVO
} from '../../models/constantes';

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
    await this.obtenerListaInasistencias();
    this.inasistencia.fecha = new Date();
    await this.datosEstudiante.obtenerEstudiante();
    this.usuario.identificacion = this.datosEstudiante.estudiante.identificacion;
    this.inasistencia.estudianteInasistencia = this.usuario;
  }

  public async mostrarListaButton() {
    await this.obtenerListaInasistencias();
    if (this.InasistenciasUsuario.length === 0) {
      this.mostrarLista = false;
      this.alerta.showToast(INFO_LISTA_VACIA.concat('inasistencias'), 'secondary');
    }
    else {
      this.mostrarLista = !this.mostrarLista;
    }
  }

  public cambioFecha(event) {
    this.inasistencia.fecha = new Date(event.detail.value);
  }

  private async obtenerListaInasistencias() {
    await this.datosEstudiante.obtenerInasistencias();
    if (this.datosEstudiante.inasistencias !== null) {
      this.InasistenciasUsuario = this.datosEstudiante.inasistencias;
    }
  }

  private validarFecha(): boolean {
    if (this.inasistencia.fecha.getMonth() < this.mesMInimo ||
      this.inasistencia.fecha.getDate() < this.diaMinimo) {
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

  public CrearInansistencia() {
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
      this.saveInasistencias.push(this.inasistencia);
      if (this.saveInasistencias.length > 1) {
        this.saveInasistencias.pop();
      }
      this.inasitenciaService.createInasistencia(this.saveInasistencias)
        .subscribe(async (data: string) => {
          this.alerta.showToast(GUARDAR_INASISTENCIA_EXITO, 'success');
          this.datosEstudiante.getEstudiante(this.usuario);
          this.mostrarLista = false;
        }, async error => {
          this.alerta.presentAlert(MENSAJE_ERROR, GUARDAR_INASISTENCIA_ERROR);
          console.log(error);
        });
    }
  }

}
