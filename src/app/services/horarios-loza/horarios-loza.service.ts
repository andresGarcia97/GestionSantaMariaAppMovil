import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { LavadoLoza } from 'src/app/models/interfaces';
import { INFO_ERROR_ACTUALIZAR_HORARIOS_LOZA } from 'src/app/models/mensajes';
import { environment } from 'src/environments/environment';
import { AlertsService } from '../alerts/alerts.service';

const ENDPOINT_LAVADO_LOZA = environment.LOCALHOST.concat('lavadoloza/');
const OBTENER_HORARIOS_LOZA = ENDPOINT_LAVADO_LOZA.concat('horarios');

@Injectable({
  providedIn: 'root'
})

export class HorariosLozaService {

  public horarios: LavadoLoza[] = [];
  private horariosString = '';

  private headersjson = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private storage: Storage, private alerts: AlertsService) { }

  public async getHorariosLoza() {
    return this.http.get<LavadoLoza[]>(OBTENER_HORARIOS_LOZA, { headers: this.headersjson })
      .subscribe(async (data: LavadoLoza[]) => {
        await this.guardarHorarios(data);
      }, async error => {
        this.alerts.showToast(INFO_ERROR_ACTUALIZAR_HORARIOS_LOZA, 'warning', 1000);
      });
  }

  public async guardarHorarios(horarios: LavadoLoza[]) {
    await this.storage.set('horariosLoza', JSON.stringify(horarios));
  }

  private async cargarHorarios(){
    this.horariosString = await this.storage.get('horariosLoza') || null;
    return this.horariosString;
  }

  public async obtenerHorarios(): Promise<LavadoLoza[]> {
    this.horarios = [];
    await this.cargarHorarios();
    this.horarios = JSON.parse(this.horariosString);
    this.horariosString = '';
    return this.horarios;
  }

}
