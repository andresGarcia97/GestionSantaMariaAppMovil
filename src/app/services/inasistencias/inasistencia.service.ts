import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { InasistenciaAlimentacion } from '../../models/interfaces';
import { LoginService } from '../login/login.service';

const ENDPOINT_INASISTENCIA = environment.LOCALHOST.concat('inasistencias/');
const CREAR_INASISTENCIA = ENDPOINT_INASISTENCIA.concat('crearinasistencias');

@Injectable({
  providedIn: 'root'
})

export class InasistenciaService {

  constructor(private http: HttpClient, private loginToken: LoginService) { }

  public async createInasistencia(inasistencias: InasistenciaAlimentacion[]){
    await this.loginToken.cargarToken();
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: this.loginToken.token }) };
    return this.http.post<string>(CREAR_INASISTENCIA, inasistencias, options);
  }
}
