import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Estudiante } from 'src/app/models/Estudiante';
import { OBTENER_ESTUDIANTE } from 'src/environments/environment';
import { InasistenciaAlimentacion, User } from '../../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  public estudiante: Estudiante;
  public instancia = new Estudiante();
  public inasistencias: InasistenciaAlimentacion[] = [];
  public estudianteString = '';

  private headersjson = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private storage: Storage) { }

  public getEstudiante(estudiante: User): any {
    return this.http.post<Estudiante>(OBTENER_ESTUDIANTE, estudiante, { headers: this.headersjson })
      .subscribe(async (data: Estudiante) => {
        await this.guardarEstudiante(data);
      }, async error => {
        console.log(error);
        await this.borrarEstudiante();
      });
  }

  public async guardarEstudiante(estudiante: Estudiante) {
    await this.storage.set('estudiante', JSON.stringify(estudiante));
  }

  public async cargarEstudiante() {
    this.estudianteString = await this.storage.get('estudiante') || null;
  }

  public async obtenerEstudiante(): Promise<Estudiante> {
      await this.cargarEstudiante();
      this.estudiante = this.instancia.crear(JSON.parse(this.estudianteString));
      return this.estudiante;
  }

  public async obtenerInasistencias(): Promise<InasistenciaAlimentacion[]> {
    await this.cargarEstudiante();
    this.inasistencias = this.instancia.crear(JSON.parse(this.estudianteString)).inasistencias;
    return this.inasistencias;
  }

  public async borrarEstudiante() {
    this.storage.remove('estudiante');
  }

}
