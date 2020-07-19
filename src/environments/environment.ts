// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};
const LOCALHOST = 'http://localhost:8080/';

export const LOGIN = LOCALHOST.concat('login');

export const ENDPOINT_USUARIOS = LOCALHOST.concat('usuario/');
export const ENDPOINT_ESTUDIANTE = LOCALHOST.concat('estudiante/');
export const ENDPOINT_INASISTENCIA = LOCALHOST.concat('inasistencias/');
export const ENDPOINT_SALIDA = LOCALHOST.concat('salidas/');
export const ENDPOINT_RESERVA = LOCALHOST.concat('reservas/');
export const ENDPOINT_MATERIA = LOCALHOST.concat('materia/');

export const ACTUALIZAR_USUARIO = ENDPOINT_USUARIOS.concat('actualizarusuario');
export const OBTENER_ESTUDIANTE = ENDPOINT_ESTUDIANTE.concat('buscarestudiante');
export const CREAR_INASISTENCIA = ENDPOINT_INASISTENCIA.concat('crearinasistencias');
export const CREAR_SALIDA = ENDPOINT_SALIDA.concat('guardarsalida');

export const OBTENER_RESERVAS_FUTURAS = ENDPOINT_RESERVA.concat('pordia');
export const CREAR_RESERVA = ENDPOINT_RESERVA.concat('crearreserva');
export const ACTUALIZAR_RESERVA = ENDPOINT_RESERVA.concat('actualizarreserva');
export const ELIMINAR_RESERVA = ENDPOINT_RESERVA.concat('borrarreserva');

export const CREAR_MATERIA = ENDPOINT_MATERIA.concat('agregarmateria');
export const ACTUALIZAR_MATERIA = ENDPOINT_MATERIA.concat('actualizarmateria');
export const ELIMINAR_MATERIA = ENDPOINT_MATERIA.concat('eliminarmateria');

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
