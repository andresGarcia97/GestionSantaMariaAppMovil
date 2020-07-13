import { Component, OnInit } from '@angular/core';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { Labor, User } from '../../models/interfaces';

@Component({
  selector: 'app-labor',
  templateUrl: './labor.page.html',
  styleUrls: ['./labor.page.scss'],
})
export class LaborPage implements OnInit {

  public listaLabores: Labor[] = [];
  public usuario = new User();

  constructor(private labores: EstudianteService) { }

  async ngOnInit() {
    await this.labores.obtenerLabores();
    this.listaLabores = this.labores.labores;
  }
}
