import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { User } from '../../models/interfaces';
import { LOGIN } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  token: string = null;
  public autenticado: User = null;

  constructor(private http: HttpClient, private storage: Storage) { }

  private headersjson = new HttpHeaders({ 'Content-Type': 'application/json' });

  public login(usuario: User) {
    return this.http.post<any>(LOGIN, usuario, { headers: this.headersjson });
  }

  public async guardarUsuario(usuario: User) {
    this.autenticado = usuario;
    await this.storage.set('usuario', usuario);
  }

  public async borrarUsuario() {
    await this.storage.remove('usuario');
  }

  public obtenerUsuario() {
    if (this.storage.get('usuario') !== null) {
      return this.autenticado;
    }
    else {
      return null;
    }
  }

}
