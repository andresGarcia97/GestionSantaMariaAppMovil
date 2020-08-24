import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { LOGIN_ERRONEO, MENSAJE_ERROR } from 'src/app/models/mensajes';
import { environment } from 'src/environments/environment';
import { Token, User } from '../../models/interfaces';
import { AlertsService } from '../alerts/alerts.service';

const LOGIN = environment.LOCALHOST.concat('login');

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  token: string = null;

  constructor(private http: HttpClient, private storage: Storage
    , private navCrtl: NavController, private alertas: AlertsService) { }

  private headersjson = new HttpHeaders({ 'Content-Type': 'application/json' });

  public async login(usuario: User) {
    this.http.post<string>(LOGIN, usuario, { headers: this.headersjson })
      .subscribe(async (data: any) => {
        await this.guardarToken(data);
      }, async error => {
        await this.borrarStorage();
        this.alertas.presentAlert(MENSAJE_ERROR, LOGIN_ERRONEO);
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

  public async obtenerValorToken(): Promise<string> {
    await this.cargarToken();
    return this.token.toString();
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
