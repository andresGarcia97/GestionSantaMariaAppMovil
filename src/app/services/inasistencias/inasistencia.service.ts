import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { InasistenciaAlimentacion } from '../../models/interfaces';
import { CREAR_INASISTENCIA } from '../../../environments/environment';
import { Observable } from 'rxjs';

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
