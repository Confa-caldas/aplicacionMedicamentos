// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  identificacionFacial:
    'https://identidad.confa.co/transaccionAutenticacionWS/',
  consultarIp: 'https://appint.confa.co/consultaIP/circular007/obtenerIP/',
  consultaLambdaDirecta: 'https://api-facial.confa.co/identificarvalidar',
  excepcionFacial: 'ojos-boca-dimension-gafasDeSol-brillo',
  tipoValidacionFacial: 'validacion',
// identificacionSas: 'https://app.confa.co:8361/medicamentosWS/rest/medicamentos/', // ruta apuntando al nbappo
identificacionSas: 'http://localhost:8081/medicamentosWS/rest/medicamentos/',
 //identificacionSas: 'https://sasweb.confa.co:8322/medicamentosWS/rest/medicamentos/', //ruta apuntando al DMZSAS
  //identificacionSas: 'https://sasweb.confa.co:8586/medicamentosWS/rest/medicamentos/', // producción
  parametro1: "hlZTM4ZDcwNDRlODcyNzZDX1BPUlQqMjAxOCQ=", 
  parametro2: "UG9ydGFsX0NvbmZhODRkZGZiMzQxMjZmYzNhND",
  apiIngresoConfa: "https://app.confa.co:8687/ingresoConfaWSSGC/rest/", //ruta de pruebas apuntando a genesys
};

