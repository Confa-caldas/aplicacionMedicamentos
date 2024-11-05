export interface RespuestaValida {
    codigoSab: string;
    convenio: string;
    plan: string;
    nomPlan: string;
    hcAfiliacion: string;
    hcAdicional: string;
    pacienteNombre: string;
    tipoIdentificacion: string;
    pacienteIdentificacion: string;
    sexo: string;
    fechaNacimiento: string;
    listInsumos: any[];
    listMedicamentos: any[];
    respuesta: string;
}

export interface RespuestaValidaPlaneacion {
    listaMedicamentos: any[];
    respuesta: string;
}

export interface RespuestaValidaAplicaciones {
    listaMedicamentos: any[];
    respuesta: string;
}
  
export interface RespuestaValida {
    mensaje: string;
}

export interface RespuestaInvalida {
    mensaje: string;
}
  
export type RespuestaServidor = RespuestaValida | RespuestaInvalida;
