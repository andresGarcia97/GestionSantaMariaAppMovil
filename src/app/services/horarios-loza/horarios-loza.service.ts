import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { LavadoLoza } from 'src/app/models/interfaces';
import { INFO_ERROR_ACTUALIZAR_HORARIOS_LOZA, LOGOUT_FORZADO, MENSAJE_ERROR } from 'src/app/models/mensajes';
import { environment } from 'src/environments/environment';
import { AlertsService } from '../alerts/alerts.service';
import { LoginService } from '../login/login.service';

const ENDPOINT_LAVADO_LOZA = environment.LOCALHOST.concat('lavadoloza/');
const OBTENER_HORARIOS_LOZA = ENDPOINT_LAVADO_LOZA.concat('horarios');
const lozaStorage = 'horariosLoza';

@Injectable({
  providedIn: 'root'
})

export class HorariosLozaService {

  public horarios: LavadoLoza[] = [];
  private horariosString = '';

  constructor(private http: HttpClient, private storage: Storage,
    private alerts: AlertsService, private loginToken: LoginService) { }

  public async getHorariosLoza() {
    try {
      await this.loginToken.cargarToken();
      const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: this.loginToken.token }) };
      const peticion = await this.http.get<LavadoLoza[]>(OBTENER_HORARIOS_LOZA, options).toPromise();
      await this.guardarHorarios(peticion);
    } catch (error) {
      if (error.status === 401) {
        this.alerts.presentAlert(MENSAJE_ERROR, LOGOUT_FORZADO);
        this.loginToken.logout();
      }
      else {
        this.alerts.showToast(INFO_ERROR_ACTUALIZAR_HORARIOS_LOZA, 'secondary', 1000);
      }
    }
  }

  public async guardarHorarios(horarios: LavadoLoza[]) {
    await this.storage.set(lozaStorage, JSON.stringify(horarios));
  }

  private async cargarHorarios() {
    this.horariosString = await this.storage.get(lozaStorage) || null;
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
