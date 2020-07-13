import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Reserva } from 'src/app/models/interfaces';
import { CREAR_RESERVA, OBTENER_RESERVAS_FUTURAS } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  public reservas: Reserva[] = [];
  private reservasString = '';

  private headersjson = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private storage: Storage) { }

  public getReservas(reserva: Reserva): any {
    return this.http.post<Reserva[]>(OBTENER_RESERVAS_FUTURAS, reserva, { headers: this.headersjson })
      .subscribe(async (data: Reserva[]) => {
        await this.guardarReservas(data);
        console.log(data);
      }, async error => {
        console.log(error);
      });
  }

  public saveReserva(reserva: Reserva): any {
    return this.http.post<string>(CREAR_RESERVA, reserva, { headers: this.headersjson });
  }

  private async guardarReservas(reservas: Reserva[]) {
    await this.storage.set('reservas', JSON.stringify(reservas));
  }

  private async cargarReservas() {
    this.reservasString = await this.storage.get('reservas') || null;
  }

  public async ObtenerReservas(): Promise<Reserva[]> {
    await this.cargarReservas();
    this.reservas = JSON.parse(this.reservasString);
    return this.reservas;
  }
}
