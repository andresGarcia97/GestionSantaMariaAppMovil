import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/services/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioGuard implements CanLoad {

  constructor(private loginSuccess: LoginService) {}

  canLoad(): boolean | Observable<boolean> | Promise<boolean> {
    return this.loginSuccess.validarToken();
  }
}
