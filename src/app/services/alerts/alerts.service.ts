import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { LOGIN_EXITOSO } from 'src/app/models/mensajes';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor(private alertController: AlertController, private toastController: ToastController) { }

  async presentAlert(tipoMensaje: string, mensaje: string) {
    const alert = await this.alertController.create({
      animated: true,
      header: tipoMensaje,
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();
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
