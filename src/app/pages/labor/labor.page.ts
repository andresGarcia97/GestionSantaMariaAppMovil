import { Component, OnInit } from '@angular/core';
import { INFO_NO_TIENE_LABORES } from 'src/app/models/mensajes';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { Labor, User } from '../../models/interfaces';

@Component({
  selector: 'app-labor',
  templateUrl: './labor.page.html',
  styleUrls: ['./labor.page.scss'],
})
export class LaborPage implements OnInit {

  public listaLabores: Labor[] = [];
  public usuario = new User();

  constructor(private labores: EstudianteService, private alerta: AlertsService) { }

  async ngOnInit() {
    await this.labores.obtenerLabores();
    this.listaLabores = this.labores.labores;
    if (this.listaLabores.length === 0) {
      this.alerta.showToast(INFO_NO_TIENE_LABORES, 'secondary');
    }
  }

}
