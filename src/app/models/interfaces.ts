export class User {
    identificacion: number;
    nombre: string;
    apellido: string;
    telefono: string;
    contrasena: string;
    correo: string;
    tipoUsuario: string;
    constructor(){}
}

export interface Componente {
    icon: string;
    name: string;
    redirectTo: string;
}

export class Horario {
    horaInicial: Date;
    dia: string;
    horaFinal: Date;
    constructor(){}
}

export class Materia {
    nombreMateria: string;
    horarios: Horario[];
    constructor(){}
}

export class InasistenciaAlimentacion {
    estudiante: User;
    horaAlimentacion: string;
    fecha: Date;
    motivo: string;
    constructor(){}
}

export class LavadoLoza {
    estudiantes: User[];
    dia: string;
    turno: string;
    constructor(){}
}

export class Labor {
    estudiante: User;
    descripcion: string;
    espacio: string;
    frecuencia: string;
    constructor(){}
}

export class Salida {
    estudiante: User;
    fechaSalida: Date;
    razon: string;
    fechaLlegada: Date;
    lugar: string;
    constructor(){}
}
