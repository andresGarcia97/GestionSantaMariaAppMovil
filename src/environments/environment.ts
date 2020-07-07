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

export const ACTUALIZAR_USUARIO = ENDPOINT_USUARIOS.concat('actualizarusuario');
export const OBTENER_ESTUDIANTE = ENDPOINT_ESTUDIANTE.concat('buscarestudiante');



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
