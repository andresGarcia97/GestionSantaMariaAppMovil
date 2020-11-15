import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Materia } from 'src/app/models/interfaces';
import { environment } from 'src/environments/environment';
import { LoginService } from '../login/login.service';

const ENDPOINT_MATERIA = environment.LOCALHOST.concat('materia/');
const CREAR_MATERIA = ENDPOINT_MATERIA.concat('agregarmateria');
const ACTUALIZAR_MATERIA = ENDPOINT_MATERIA.concat('actualizarmateria');
const ELIMINAR_MATERIA = ENDPOINT_MATERIA.concat('eliminarmateria');

@Injectable({
  providedIn: 'root'
})

export class MateriasService {

  constructor(private http: HttpClient, private loginToken: LoginService) { }

  options = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: this.loginToken.token }) };

  public async createMateria(materia: Materia) {
    await this.loginToken.cargarToken();
    return this.http.post(CREAR_MATERIA, materia, this.options);
  }

  public async updateMateria(materias: Materia[]) {
    await this.loginToken.cargarToken();
    return this.http.put(ACTUALIZAR_MATERIA, materias, this.options);
  }

  public async deleteMateria(materia: Materia) {
    await this.loginToken.cargarToken();
    const bodyMateria = JSON.stringify(materia);
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: this.loginToken.token })
      , body: bodyMateria
    };
    return this.http.delete(ELIMINAR_MATERIA, options);
  }
}
