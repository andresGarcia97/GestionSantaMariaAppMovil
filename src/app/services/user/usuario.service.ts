import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CambioPassword, User } from '../../models/interfaces';
import { LoginService } from '../login/login.service';

const ENDPOINT_USUARIOS = environment.LOCALHOST.concat('usuario/');
const ACTUALIZAR_USUARIO = ENDPOINT_USUARIOS.concat('actualizarusuario');
const CAMBIAR_CONTRASEÑA = ENDPOINT_USUARIOS.concat('cambiarcontrasena');

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

  constructor(private http: HttpClient, private loginToken: LoginService) { }

  options = { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: this.loginToken.token }) };

  public async update(usuario: User) {
    await this.loginToken.cargarToken();
    return this.http.put<User>(ACTUALIZAR_USUARIO, usuario, this.options);
  }

  public async updatePassword(newPassword: CambioPassword) {
    await this.loginToken.cargarToken();
    return this.http.put(CAMBIAR_CONTRASEÑA, newPassword, this.options);
  }
}
