import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Reserva } from 'src/app/models/interfaces';
import { CREAR_RESERVA, OBTENER_RESERVAS_FUTURAS, ACTUALIZAR_RESERVA, ELIMINAR_RESERVA } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  public reservas: Reserva[] = [];
  private reservasString = '';

  private headersjson = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private storage: Storage) { }

  public async getReservas(reserva: Reserva) {
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

  public updateReserva(reservas: Reserva[]): any {
    return this.http.put<string>(ACTUALIZAR_RESERVA, reservas, { headers: this.headersjson });
  }

  public deleteReserva(reserva: Reserva): any {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {
        usuario: {
          identificacion: reserva.usuario.identificacion
        },
        fechaInicial: reserva.fechaInicial,
        actividad: reserva.actividad,
        fechaFinal: reserva.fechaFinal,
        espacio: reserva.espacio
      }
    };
    console.log(options);
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
