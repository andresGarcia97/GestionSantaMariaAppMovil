import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Salida } from '../../models/interfaces';
import { Observable } from 'rxjs';
import { CREAR_SALIDA } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalidasService {

  private headersjson = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  public createSalida(inasistencia: Salida): Observable<string>{
    return this.http.post<string>(CREAR_SALIDA, inasistencia, { headers: this.headersjson });
  }
}
