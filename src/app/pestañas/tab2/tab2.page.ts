import { Component, OnInit } from '@angular/core';
import { InasistenciaAlimentacion, User } from '../../models/interfaces';
import { PickerController } from '@ionic/angular';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { MENSAJE_ERROR, GUARDAR_INASISTENCIA_EXITO, GUARDAR_INASISTENCIA_ERROR } from 'src/app/models/mensajes';
import { InasistenciaService } from '../../services/inasistencias/inasistencia.service';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { ERROR_FECHA_PASADA, ERROR_MOTIVO_HORA_FALTANTES } from '../../models/mensajes';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  diaYHora = [
    ['PERSONAL', 'ACADEMICO', 'RECREATIVO'],
    ['DESAYUNO', 'ALMUERZO', 'CENA']
  ];

  public saveInasistencias: InasistenciaAlimentacion[] = [];
  public fechaInasistencia = new Date();
  public yearMInimo = this.fechaInasistencia.getFullYear();
  public mesMInimo = this.fechaInasistencia.getMonth();
  public diaMinimo = this.fechaInasistencia.getDate();
  public inasistencia = new InasistenciaAlimentacion();
  public usuario = new User();

  constructor(private pickerController: PickerController, private alerta: AlertsService,
    private inasitenciaService: InasistenciaService, private datosEstudiante: EstudianteService) { }

  async ngOnInit() {
    this.inasistencia.fecha = new Date();
    await this.datosEstudiante.obtenerEstudiante();
    this.usuario.identificacion = this.datosEstudiante.estudiante.identificacion;
    this.inasistencia.estudiante = this.usuario;
  }

  cambioFecha(event) {
    this.inasistencia.fecha = new Date(event.detail.value);
  }

  public validarFecha(): boolean {
    if (this.inasistencia.fecha.getMonth() < this.mesMInimo ||
      this.inasistencia.fecha.getDate() < this.diaMinimo) {
      this.inasistencia.fecha = this.fechaInasistencia;
      return false;
    }
    return true;
  }

  public validarCampos(): boolean {
    if (!this.inasistencia.motivo || !this.inasistencia.horaAlimentacion) {
      return false;
    }
    return true;
  }

  public async openPicker(numColumns: number, numOptions: number) {
    const picker = await this.pickerController.create({
      columns: this.getColumns(numColumns, numOptions, this.diaYHora),
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

  public getColumns(numColumns, numOptions, columnOptions) {
    const columns = [];
    for (let i = 0; i < numColumns; i++) {
      columns.push({
        name: `col-${i}`,
        options: this.getColumnOptions(i, numOptions, columnOptions)
      });
    }
    return columns;
  }

  public getColumnOptions(columnIndex, numOptions, columnOptions) {
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
    if (!this.validarFecha()) {
      this.alerta.presentAlert(MENSAJE_ERROR, ERROR_FECHA_PASADA);
    }
    else if (!this.validarCampos()) {
      this.alerta.presentAlert(MENSAJE_ERROR, ERROR_MOTIVO_HORA_FALTANTES);
    }
    else {
      this.saveInasistencias.push(this.inasistencia);
      console.log(this.saveInasistencias);
      this.inasitenciaService.createInasistencia(this.saveInasistencias)
        .subscribe(async (data: string) => {
          this.alerta.showToast(GUARDAR_INASISTENCIA_EXITO, 'success');
          console.log(data);
        }, async error => {
          this.alerta.presentAlert(MENSAJE_ERROR, GUARDAR_INASISTENCIA_ERROR);
          console.log(error);
        });
    }
  }

}
