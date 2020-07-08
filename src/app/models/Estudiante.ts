import { Materia, InasistenciaAlimentacion, LavadoLoza, Labor, Salida } from './interfaces';

export class Estudiante {
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
    public crear(estudiante: Estudiante){
        this.identificacion = estudiante.identificacion;
        this.nombre = estudiante.nombre;
        this.apellido = estudiante.apellido;
        this.telefono = estudiante.telefono;
        this.correo = estudiante.correo;
        this.tipoUsuario = estudiante.tipoUsuario;
        return estudiante;
    }
}
