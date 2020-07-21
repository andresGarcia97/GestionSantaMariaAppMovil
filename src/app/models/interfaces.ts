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

export class TurnoLoza {
    dia: string;
    turno: string;
    constructor(){}
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
    estudiante: User;
    constructor(){}
}

export class InasistenciaAlimentacion {
    estudianteInasistencia: User;
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
    estudianteLabor: User;
    descripcion: string;
    espacio: string;
    frecuencia: string;
    constructor(){}
}

export class Salida {
    estudianteSalida: User;
    fechaSalida: Date;
    razon: string;
    fechaLlegada: Date;
    lugar: string;
    constructor(){}
}

export class Reserva {
    usuario: User;
    fechaInicial: Date;
    actividad: string;
    fechaFinal: Date;
    espacio: string;
    constructor(){}
}
