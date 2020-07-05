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

export class Estudiante extends User {
    universidad: string;
    firma: ImageBitmap;
}

export interface Componente {
    icon: string;
    name: string;
    redirectTo: string;
}
