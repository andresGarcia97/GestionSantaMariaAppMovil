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
    firma: ImageData;
    materias: Materia[];
    inasistencias: InasistenciaAlimentacion[];
    labores: Labor[];
    salidas: Salida[];
    constructor() { }
}
