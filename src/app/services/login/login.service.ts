import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { Token, User } from '../../models/interfaces';

const LOGIN = environment.LOCALHOST.concat('login');
const tokenName = 'S_T_A_A_I';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  public token: string = null;

  constructor(private http: HttpClient, private storage: Storage
    , private navCrtl: NavController) { }

  private headersjson = new HttpHeaders({ 'Content-Type': 'application/json' });

  public async login(usuario: User): Promise<any> {
    return this.http.post<string>(LOGIN, usuario, { headers: this.headersjson })
      .subscribe(async (data: any) => {
        await this.guardarToken(data);
        return Promise.resolve();
      }, async () => {
        await this.borrarStorage();
        return Promise.reject();
      });
  }

  public async guardarToken(token: Token) {
    await this.storage.set(tokenName, token.token);
  }

  public async borrarStorage() {
    await this.storage.clear();
  }

  public async cargarToken() {
    this.token = await this.storage.get(tokenName) || null;
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
