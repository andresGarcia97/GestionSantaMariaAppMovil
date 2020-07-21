import { Component, OnInit } from '@angular/core';
import { LavadoLoza, TurnoLoza, User } from '../../models/interfaces';
import { EstudianteService } from '../../services/estudiante/estudiante.service';
import { HorariosLozaService } from '../../services/horarios-loza/horarios-loza.service';

@Component({
  selector: 'app-horarios-loza',
  templateUrl: './horarios-loza.page.html',
  styleUrls: ['./horarios-loza.page.scss'],
})
export class HorariosLozaPage implements OnInit {

  horariosLoza: LavadoLoza[] = [];
  mostrarHorarios = false;
  mostrarTurnoEstudiante = false;
  dia = 'LUNES';
  diasYTurnos: TurnoLoza[] = [];
  usuario = new User();

  constructor(private horariosLozaService: HorariosLozaService, private datosEstudiante: EstudianteService) { }

  async ngOnInit() {
    this.mostrarHorarios = false;
    await this.horariosLozaService.getHorariosLoza();
    await this.horariosLozaService.obtenerHorarios();
    this.horariosLoza = this.horariosLozaService.horarios;
    this.mostrarHorarios = true;
    this.mostrarTurnoEstudiante = await this.filtrarEstudiante();
  }

  public segmentChanged(event) {
    const valorFiltro = event.detail.value;
    if (valorFiltro === '') {
      this.dia = 'LUNES';
    }
    else {
      this.dia = valorFiltro;
    }
  }

  private async obtenerEstudiante() {
    await this.datosEstudiante.obtenerEstudiante();
    this.usuario.identificacion = this.datosEstudiante.estudiante.identificacion;
    return this.usuario;
  }

  async filtrarEstudiante(): Promise<boolean> {
    await this.obtenerEstudiante();
    let horariosEstudiante = false;
    this.horariosLoza.forEach(horario => {
      horario.estudiantes.forEach(estudiante => {
        if (estudiante.identificacion === this.usuario.identificacion) {
          let turno: TurnoLoza = new TurnoLoza();
          turno.dia = horario.dia;
          turno.turno = horario.turno;
          this.diasYTurnos.push(turno);
          horariosEstudiante = true;
        }
      });
    });
    console.log(this.diasYTurnos);
    return horariosEstudiante;
  }

}
