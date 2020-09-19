import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Reserva } from 'src/app/models/interfaces';
import { INFO_ERROR_ACTUALIZAR_HORARIOS_RESERVAS, INFO_LISTA_VACIA_RESERVAS, LOGOUT_FORZADO, MENSAJE_ERROR } from 'src/app/models/mensajes';
import { environment } from 'src/environments/environment';
import { AlertsService } from '../alerts/alerts.service';
import { LoginService } from '../login/login.service';

const ENDPOINT_RESERVA = environment.LOCALHOST.concat('reservas/');
const OBTENER_RESERVAS_FUTURAS = ENDPOINT_RESERVA.concat('pordia');
const CREAR_RESERVA = ENDPOINT_RESERVA.concat('crearreserva');
const ACTUALIZAR_RESERVA = ENDPOINT_RESERVA.concat('actualizarreserva');
const ELIMINAR_RESERVA = ENDPOINT_RESERVA.concat('borrarreserva');

@Injectable({
  providedIn: 'root'
})

export class ReservasService {

  public reservas: Reserva[] = [];
  private reservasString = '';

  constructor(private http: HttpClient, private storage: Storage,
    private alerts: AlertsService, private loginToken: LoginService) { }

  public async getReservas(reserva: Reserva) {
    await this.loginToken.cargarToken();
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: this.loginToken.token }) };
    return this.http.post<Reserva[]>(OBTENER_RESERVAS_FUTURAS, reserva, options)
      .subscribe(async (data: Reserva[]) => {
        await this.guardarReservas(data);
        this.alerts.showToast(INFO_LISTA_VACIA_RESERVAS, 'secondary');
      }, async error => {
        if (error.status === 401) {
          this.alerts.presentAlert(MENSAJE_ERROR, LOGOUT_FORZADO);
          this.loginToken.logout();
        }
        else {
          this.alerts.showToast(INFO_ERROR_ACTUALIZAR_HORARIOS_RESERVAS, 'secondary', 1000);
        }
      });
  }

  public async saveReserva(reserva: Reserva) {
    await this.loginToken.cargarToken();
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: this.loginToken.token }) };
    return this.http.post<string>(CREAR_RESERVA, reserva, options);
  }

  public async updateReserva(reservas: Reserva[]) {
    await this.loginToken.cargarToken();
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: this.loginToken.token }) };
    return this.http.put<string>(ACTUALIZAR_RESERVA, reservas, options);
  }

  public async deleteReserva(reserva: Reserva) {
    await this.loginToken.cargarToken();
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.loginToken.token
      }),
      body: {
        usuario: { identificacion: reserva.usuario.identificacion },
        fechaInicial: reserva.fechaInicial,
        actividad: reserva.actividad,
        fechaFinal: reserva.fechaFinal,
        espacio: reserva.espacio
      }
    };
    return this.http.delete<string>(ELIMINAR_RESERVA, options);
  }

  private async guardarReservas(reservas: Reserva[]) {
    await this.storage.set('reservas', JSON.stringify(reservas));
  }

  private async cargarReservas() {
    this.reservasString = await this.storage.get('reservas') || null;
    return this.reservasString;
  }

  public async ObtenerReservas(): Promise<Reserva[]> {
    this.reservas = [];
    await this.cargarReservas();
    this.reservas = JSON.parse(this.reservasString);
    this.reservasString = '';
    return this.reservas;
  }
}
