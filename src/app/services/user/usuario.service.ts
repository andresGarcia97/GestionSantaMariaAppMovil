import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../../models/interfaces';
import { LoginService } from '../login/login.service';

const ENDPOINT_USUARIOS = environment.LOCALHOST.concat('usuario/');
const ACTUALIZAR_USUARIO = ENDPOINT_USUARIOS.concat('actualizarusuario');

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

  constructor(private http: HttpClient, private loginToken: LoginService) { }

  public async update(usuario: User) {
    await this.loginToken.cargarToken();
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: this.loginToken.token }) };
    return this.http.put<User>(ACTUALIZAR_USUARIO, usuario, options);
  }
}
