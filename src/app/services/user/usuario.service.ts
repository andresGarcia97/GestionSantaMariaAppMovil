import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/interfaces';
import { ACTUALIZAR_USUARIO } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private headersjson = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  public update(usuario: User): Observable<User> {
    return this.http.put<User>(ACTUALIZAR_USUARIO, usuario, { headers: this.headersjson });
  }
}
