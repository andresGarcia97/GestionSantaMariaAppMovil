import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Salida } from '../../models/interfaces';

const ENDPOINT_SALIDA = environment.LOCALHOST.concat('salidas/');
const CREAR_SALIDA = ENDPOINT_SALIDA.concat('guardarsalida');

@Injectable({
  providedIn: 'root'
})

export class SalidasService {

  private headersjson = new HttpHeaders({ 'Content-Type': 'application/json' });
  constructor(private http: HttpClient) { }

  public createSalida(inasistencia: Salida): Observable<string> {
    return this.http.post<string>(CREAR_SALIDA, inasistencia, { headers: this.headersjson });
  }
}
