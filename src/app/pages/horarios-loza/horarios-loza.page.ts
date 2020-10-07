import { Component, OnInit } from '@angular/core';
import { AlertsService } from 'src/app/services/alerts/alerts.service';
import { LavadoLoza, TurnoLoza, User } from '../../models/interfaces';
import { INFO_NO_TIENE_TURNOS_LAVADO_LOZA, INFO_TODAVIA_NO_HAY_HORARIOS_LOZA } from '../../models/mensajes';
import { EstudianteService } from '../../services/estudiante/estudiante.service';
import { HorariosLozaService } from '../../services/horarios-loza/horarios-loza.service';

@Component({
  selector: 'app-horarios-loza',
  templateUrl: './horarios-loza.page.html'
})
export class HorariosLozaPage implements OnInit {

  protected horariosLoza: LavadoLoza[] = [];
  protected mostrarHorarios = false;
  protected mostrarTurnoEstudiante = false;
  protected dia = 'LUNES';
  protected diasYTurnos: TurnoLoza[] = [];
  private usuario = new User();

  constructor(private alerta: AlertsService, private horariosLozaService: HorariosLozaService,
    private datosEstudiante: EstudianteService) { }

  public async ngOnInit() {
    this.mostrarHorarios = false;
    await this.horariosLozaService.getHorariosLoza();
    await this.mostrarHorariosLoza();
  }

  private async mensajeTurnosDeLoza() {
    this.mostrarTurnoEstudiante = await this.filtrarEstudiante();
    if (this.mostrarTurnoEstudiante) {
      return this.mostrarTurnoEstudiante;
    }
    else {
      await this.alerta.showToast(INFO_NO_TIENE_TURNOS_LAVADO_LOZA, 'secondary', 1000);
      return this.mostrarTurnoEstudiante;
    }
  }

  public async obtenerListaHorarios(): Promise<LavadoLoza[]> {
    await this.horariosLozaService.obtenerHorarios();
    if (this.horariosLozaService.horarios !== null) {
      this.horariosLoza = this.horariosLozaService.horarios;
    }
    return this.horariosLoza;
  }

  public async mostrarHorariosLoza() {
    await this.obtenerListaHorarios();
    if (this.horariosLoza.length === 0) {
      this.mostrarHorarios = false;
      await this.alerta.showToast(INFO_TODAVIA_NO_HAY_HORARIOS_LOZA, 'secondary', 1500);
    }
    await this.mensajeTurnosDeLoza();
    this.mostrarHorarios = true;
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

  private async filtrarEstudiante(): Promise<boolean> {
    await this.obtenerEstudiante();
    let horariosEstudiante = false;
    this.horariosLoza.forEach(horario => {
      horario.estudiantes.forEach(estudiante => {
        if (estudiante.identificacion === this.usuario.identificacion) {
          const turno: TurnoLoza = new TurnoLoza();
          turno.dia = horario.dia;
          turno.turno = horario.turno;
          this.diasYTurnos.push(turno);
          horariosEstudiante = true;
        }
      });
    });
    return horariosEstudiante;
  }

}
