import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Materia } from 'src/app/models/interfaces';
import { environment } from 'src/environments/environment';

const ENDPOINT_MATERIA = environment.LOCALHOST.concat('materia/');
const CREAR_MATERIA = ENDPOINT_MATERIA.concat('agregarmateria');
const ACTUALIZAR_MATERIA = ENDPOINT_MATERIA.concat('actualizarmateria');
const ELIMINAR_MATERIA = ENDPOINT_MATERIA.concat('eliminarmateria');

@Injectable({
  providedIn: 'root'
})

export class MateriasService {

  private headersjson = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  public createMateria(materia: Materia): Observable<string> {
    return this.http.post<string>(CREAR_MATERIA, materia, { headers: this.headersjson });
  }

  public updateMateria(materias: Materia[]): Observable<string> {
    return this.http.put<string>(ACTUALIZAR_MATERIA, materias, { headers: this.headersjson });
  }

  public deleteMateria(materia: Materia): Observable<string> {
    const bodyMateria = JSON.stringify(materia);
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: bodyMateria
    };
    return this.http.delete<string>(ELIMINAR_MATERIA, options);
  }

}
