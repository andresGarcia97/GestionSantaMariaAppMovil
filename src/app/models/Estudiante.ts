import { InasistenciaAlimentacion, Labor, Materia, Salida } from './interfaces';

export class Estudent {
    identificacion: number;
    nombre: string;
    apellido: string;
    telefono: string;
    contrasena: string;
    correo: string;
    tipoUsuario: string;
    universidad: string;
    // imagen codificada en base64
    firma: string;
    materias: Materia[];
    inasistencias: InasistenciaAlimentacion[];
    labores: Labor[];
    salidas: Salida[];
    constructor() { }
}
