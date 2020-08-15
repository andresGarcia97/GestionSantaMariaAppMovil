import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Estudent } from 'src/app/models/Estudiante';
import { environment } from 'src/environments/environment';
import { InasistenciaAlimentacion, Labor, Materia, Salida, User } from '../../models/interfaces';

const ENDPOINT_ESTUDIANTE = environment.LOCALHOST.concat('estudiante/');
const OBTENER_ESTUDIANTE = ENDPOINT_ESTUDIANTE.concat('buscarestudiante');
const AGREGAR_FIRMA_ESTUDIANTE = ENDPOINT_ESTUDIANTE.concat('agregardatos');

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  public estudiante: Estudent;
  public instancia = new Estudent();
  public estudianteString = '';

  public inasistencias: InasistenciaAlimentacion[] = [];
  public labores: Labor[] = [];
  public salidas: Salida[] = [];
  public materias: Materia[] = [];
  public firma = '';

  private headersjson = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private storage: Storage) { }

  public getEstudiante(estudiante: User): any {
    return this.http.post<Estudent>(OBTENER_ESTUDIANTE, estudiante, { headers: this.headersjson })
      .subscribe(async (data: Estudent) => {
        await this.guardarEstudiante(data);
      }, async error => {
        await this.borrarEstudiante();
      });
  }

  public agregarFirmaYUniversidad(estudiante: Estudent): any {
    return this.http.post<string>(AGREGAR_FIRMA_ESTUDIANTE, estudiante, { headers: this.headersjson });
  }

  public async guardarEstudiante(estudiante: Estudent) {
    await this.storage.set('estudiante', JSON.stringify(estudiante));
  }

  private async cargarEstudiante() {
    this.estudianteString = await this.storage.get('estudiante') || null;
  }

  public async obtenerEstudiante(): Promise<Estudent> {
    await this.cargarEstudiante();
    this.estudiante = JSON.parse(this.estudianteString);
    return this.estudiante;
  }

  public async obtenerInasistencias(): Promise<InasistenciaAlimentacion[]> {
    await this.cargarEstudiante();
    this.inasistencias = JSON.parse(this.estudianteString).inasistencias;
    return this.inasistencias;
  }

  public async obtenerLabores(): Promise<Labor[]> {
    await this.cargarEstudiante();
    this.labores = JSON.parse(this.estudianteString).labores;
    return this.labores;
  }

  public async obtenerSalidas(): Promise<Salida[]> {
    await this.cargarEstudiante();
    this.salidas = JSON.parse(this.estudianteString).salidas;
    return this.salidas;
  }

  public async obtenerMaterias(): Promise<Materia[]> {
    await this.cargarEstudiante();
    this.materias = JSON.parse(this.estudianteString).materias;
    return this.materias;
  }

  public async obtenerFirma(): Promise<string> {
    await this.cargarEstudiante();
    this.firma = JSON.parse(this.estudianteString).firma;
    return this.firma;
  }

  public async borrarEstudiante() {
    this.storage.remove('estudiante');
  }

}
