import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/interfaces';

@Component({
  selector: 'app-updateuser',
  templateUrl: './updateuser.page.html',
  styleUrls: ['./updateuser.page.scss'],
})
export class UpdateuserPage implements OnInit {

  usuario: User = new User();

  constructor() { }

  ngOnInit() {
  }

  onSubmitTemplate() {
    console.log('Form submit');
    console.log( this.usuario );
  }

}
