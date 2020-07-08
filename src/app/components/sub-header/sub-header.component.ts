import { Component, OnInit, Input } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss'],
})
export class SubHeaderComponent implements OnInit {


  @Input() subMenu: string;

  constructor(private menuCtrl: MenuController) { }

  ngOnInit() {}

  public mostrarMenu(){
    this.menuCtrl.toggle('first');
  }

}
