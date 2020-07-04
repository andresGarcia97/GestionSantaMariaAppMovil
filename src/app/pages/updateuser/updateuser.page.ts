import { Component, OnInit } from '@angular/core';
import { User } from '../../models/interfaces';
import { UsuarioService } from '../../services/services/user/usuario.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-updateuser',
  templateUrl: './updateuser.page.html',
  styleUrls: ['./updateuser.page.scss'],
})
export class UpdateuserPage implements OnInit {

  usuario: User = new User();
  mensaje: string;

  constructor(private userService: UsuarioService, public toastController: ToastController) { }

  ngOnInit() {
  }

  public update() {
    // valor quemado hasta implementar el login
    this.usuario.identificacion = 1234;
    console.log(this.usuario);
    this.userService.update(this.usuario)
      .subscribe(data => {
        this.mensaje = ACTUALIZACION_USUARIO_EXITOSA;
        this.showToast(this.mensaje, 'success');
      }, err => {
        this.mensaje = ACTUALIZACION_USUARIO_ERRONEA;
        this.showToast(this.mensaje, 'warning');
      });
  }

  async showToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      color: (color),
      message: mensaje,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

}
