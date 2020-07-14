import { Materia, InasistenciaAlimentacion, LavadoLoza, Labor, Salida } from './interfaces';

export class Estudent {
    identificacion: number;
    nombre: string;
    apellido: string;
    telefono: string;
    contrasena: string;
    correo: string;
    tipoUsuario: string;
    universidad: string;
    firma: ImageBitmap;
    materias: Materia[];
    inasistencias: InasistenciaAlimentacion[];
    horariosLoza: LavadoLoza[];
    labores: Labor[];
    salidas: Salida[];
    constructor() {

    }
}
