import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RespuestaServidor } from '../interfaces/respuestaValida.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {}

  consultarIp() {
    const url = environment.consultarIp;
    let response = this.http.post(url, '');
    return response;
  }

  inicioSesionInternoV2(imagen: string) {
    let body = {
      imgdata: imagen,
      excepcion: environment.excepcionFacial,
      tipoValidacion: environment.tipoValidacionFacial,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': 'qfdmzeFdxN2VetG1dYgRB4jLrxHrLTveaxss0aMH',
    });
    const url = environment.consultaLambdaDirecta;
    return this.http.post(url, body, { headers });
  }

  inicioSesionSas(body: any) {
    const url = environment.identificacionSas + 'metodo1';
    let response = this.http.post(url, body);    
    return response;
  }

  obtenerPaciente(documento: string, token: string){
    const url = environment.identificacionSas + 'metodo2';
    const body = {
      documento_paciente: documento
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    let response = this.http.post(url, body, httpOptions);
    return response;
  }

  obtenerPlaneacion(admisionNumero: string, token: string, codigoSab: string){
    const url = environment.identificacionSas + 'metodo3';
    const body = {
      numero_admision: admisionNumero,
      codigo_sab: codigoSab
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    let response = this.http.post(url, body, httpOptions);
    return response;
  }
  
  esTokenValido(respuesta: RespuestaServidor): boolean {
    return 'codigoSab' in respuesta;
  }

  esTokenValidoPlaneacion(respuesta: RespuestaServidor): boolean {
    return 'listaMedicamentos' in respuesta;
  }

  esTokenValidoAplicaciones(respuesta: RespuestaServidor): boolean {
    return 'listaMedicamentos' in respuesta;
  }

  esTokenValidoGuardar(respuesta: RespuestaServidor): boolean {
    return 'estado' in respuesta;
  }

  esTokenInvalido(respuesta: RespuestaServidor): boolean {
    return 'error' in respuesta;
  }

  obtenerAplicaciones(admisionNumero: string, token: string, prefijo: string, medicamento:string, codigoSab: string){
    const url = environment.identificacionSas + 'metodo6';
    const body = {
      numero_admision: admisionNumero,
      prefijo: prefijo,
      medicamento: medicamento,
      codigo_sab: codigoSab
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    let response = this.http.post(url, body, httpOptions);
    return response;
  }

  guardarAplicacion(token: string, admisionNumero: string, usuario: string, medicamento:any, codigoSab: string){
    const url = environment.identificacionSas + 'metodo4';
    const body = {
        numero_admision: admisionNumero,
        usuario_aplica: usuario,
        aplica: medicamento.aplicar,
        secuencia_ordenamiento: medicamento.secOrdenamiento,
        num_item: medicamento.numItem,
        prefijo: medicamento.prefijo,
        codigo_medicamento: medicamento.medicamento,
        nombre_medicamento: medicamento.nombreMedicamento,
        dosis: medicamento.dosis,
        unidad_admin:medicamento.unidadAdministracion,
        via_admin:medicamento.viaAdministracion,
        indicacion_especial:medicamento.indicacionEspecial,
        frecuencia:medicamento.frecuencia,
        origen_medicamento:medicamento.origenMedicamento,
        cantidad_total:medicamento.cantidadTotal,
        cantidad_por_aplicacion: medicamento.cantidadPorAplicacion,
        cantidad_aplicado:medicamento.cantidadAplicado,
        cantidad_no_aplicado:medicamento.cantidadNoAplicado,
        causa_no_aplicacion:medicamento.causaNoAplicacion,
        id_orden:medicamento.idOrden,
        observacion_aplicacion:medicamento.observacionAplicacion, 
        estado_orden:medicamento.estadoOrden,
        horaPlaneadaAplicacion: medicamento.horaPlaneadaAplicacion,
        codigo_sab: codigoSab,
        nombre_indicacion_especial: medicamento.nombreIndicacionEspecial,
        descontar_orden: medicamento.descontarOrden,
        campo_10: medicamento.campo10Audifarma
    };


    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    let response = this.http.post(url, body, httpOptions);
    return response;
  }

  guardarInsumo(token: string, admisionNumero: string, usuario: string, insumos:any, codigoSab: string){
    const url = environment.identificacionSas + 'metodo5';
    const body = {
      numero_admision: admisionNumero,
      usuario_aplica: usuario,
      prefijo: insumos.prefijo,
      codigo_insumo: insumos.insumo,
      nombre_insumo: insumos.nombreInsumo,
      cantidad: insumos.cantidad,
      cantidad_a_usar: insumos.cantidadAUsar ,
      cantidad_usado: insumos.cantidadUsado,
      estado_orden: insumos.estadoOrden,
      codigo_sab: codigoSab,
      secuencia_ordenamiento: insumos.secOrdenamiento,
      num_item: insumos.numItem,
      id_orden: insumos.idOrden,
      campo_10: insumos.campo10Audifarma
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    let response = this.http.post(url, body, httpOptions);
    return response;
  }

  obtenerSab(token: string){
    const url = environment.identificacionSas + 'metodo7';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    let response = this.http.get(url, httpOptions);
    return response;
  }

  obtenerDatosSAB(token: string, sab: string){
    const url = environment.identificacionSas + 'metodo8';
    const body = {
      codigo_sab: sab
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    let response = this.http.post(url, body, httpOptions);
    return response;
  }

  inicioSesionSasParametros(param1: string, param2: string) {
    const url = environment.identificacionSas + 'metodo9';
    const body = {
      parametro1: param1,
      parametro2: param2
    };

    let response = this.http.post(url, body);    
    return response;
  }

}
