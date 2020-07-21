import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { LavadoLoza } from 'src/app/models/interfaces';
import { OBTENER_HORARIOS_LOZA } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HorariosLozaService {

  public horarios: LavadoLoza[] = [];
  private horariosString = '';

  private headersjson = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private storage: Storage) { }

  public async getHorariosLoza() {
    return this.http.get<LavadoLoza[]>(OBTENER_HORARIOS_LOZA, { headers: this.headersjson })
      .subscribe(async (data: LavadoLoza[]) => {
        await this.guardarHorarios(data);
        console.log(data);
      }, async error => {
        console.log(error);
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
