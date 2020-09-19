import { Component, Input } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html'
})
export class SubHeaderComponent {

  @Input() subMenu: string;

  constructor(private menuCtrl: MenuController) { }

  public mostrarMenu(){
    this.menuCtrl.toggle('first');
  }

}
