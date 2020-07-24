import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../../models/interfaces';

const ENDPOINT_USUARIOS = environment.LOCALHOST.concat('usuario/');
const ACTUALIZAR_USUARIO = ENDPOINT_USUARIOS.concat('actualizarusuario');

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
