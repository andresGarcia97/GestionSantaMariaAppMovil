import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Salida } from '../../models/interfaces';
import { LoginService } from '../login/login.service';

const ENDPOINT_SALIDA = environment.LOCALHOST.concat('salidas/');
const CREAR_SALIDA = ENDPOINT_SALIDA.concat('guardarsalida');

@Injectable({
  providedIn: 'root'
})

export class SalidasService {

  constructor(private http: HttpClient, private loginToken: LoginService) { }

  public async createSalida(inasistencia: Salida) {
    await this.loginToken.cargarToken();
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: this.loginToken.token }) };
    return this.http.post<string>(CREAR_SALIDA, inasistencia, options);
  }
}
