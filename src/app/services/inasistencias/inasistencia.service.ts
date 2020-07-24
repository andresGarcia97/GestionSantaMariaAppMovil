import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InasistenciaAlimentacion } from '../../models/interfaces';

const ENDPOINT_INASISTENCIA = environment.LOCALHOST.concat('inasistencias/');
const CREAR_INASISTENCIA = ENDPOINT_INASISTENCIA.concat('crearinasistencias');

@Injectable({
  providedIn: 'root'
})

export class InasistenciaService {

  private headersjson = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  public createInasistencia(inasistencias: InasistenciaAlimentacion[]): Observable<string>{
    return this.http.post<string>(CREAR_INASISTENCIA, inasistencias, { headers: this.headersjson });
  }
}
