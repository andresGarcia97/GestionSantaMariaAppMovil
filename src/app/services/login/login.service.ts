import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { Token, User } from '../../models/interfaces';

const LOGIN = environment.LOCALHOST.concat('login');

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  token: string = null;

  constructor(private http: HttpClient, private storage: Storage
    , private navCrtl: NavController) { }

  private headersjson = new HttpHeaders({ 'Content-Type': 'application/json' });

  public async login(usuario: User) {
    return this.http.post<string>(LOGIN, usuario, { headers: this.headersjson })
      .subscribe(async (data: any) => {
        await this.guardarToken(data);
        return Promise.resolve();
      }, async error => {
        await this.borrarStorage();
        return Promise.reject();
      });
  }

  public async guardarToken(token: Token) {
    await this.storage.set('token', token.token);
  }

  public async borrarStorage() {
    await this.storage.clear();
  }

  public async cargarToken() {
    this.token = await this.storage.get('token') || null;
  }

  public async aceptarToken(): Promise<any> {
    await this.cargarToken();
    if (this.token === null) {
      return Promise.reject();
    }
    else {
      return Promise.resolve();
    }
  }

  public async validarToken(): Promise<boolean> {

    await this.cargarToken();

    if (!this.token) {
      this.navCrtl.navigateRoot('/login', { animated: true });
      return Promise.resolve(false);
    }

    return new Promise<boolean>(resolve => {
      if (this.token === null) {
        this.navCrtl.navigateRoot('/login', { animated: true });
        resolve(false);
      }
      else {
        resolve(true);
      }
    });
  }

  public logout() {
    this.token = null;
    this.borrarStorage();
    this.navCrtl.navigateRoot('/login', { animated: true });
  }
}
