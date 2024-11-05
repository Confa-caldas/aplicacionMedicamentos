export interface UserRegister {
    sistema: string;
    linkMensaje: string;
    parametro: string;
    remitente: string;
    asunto: string;
    usuario: User;
  }
  
  export interface User {
    usuarioId?: number;
    documento: string;
    direccion: string;
    telefono: string;
    sexo: string;
    categoria: string;
    celular: string;
    correo: string;
    clave: string;
    codBeneficiario: string;
    nombreBeneficiario: string;
    fechaNacimiento: string;
    fechaRegistro: string;
    documentoTrabajador: string;
    obligaCambioContra?: boolean;
    primerNombre: string;
    segundoNombre: string;
    primerApellido: string;
    segundoApellido: string;
    link: string;
    existeUsuario: boolean;
    usuarioNasfa: boolean;
    fechaActualizacion?: string;
    sistemaActualizacion: string;
    correoMd5: string;
    aceptaHabeas: boolean;
    tipoDocumento?: string;
    preguntasValidacion: boolean;
    fechaRespuestasValidacion: string;
    bloqueoUser: boolean;
    estadoUser: string;
    contUser: number;
    bloqueo:boolean;
    preguntas:PreguntasUser;
  }
  export interface PreguntasUser {
    identificador: number,
    texto: string,
    respuestas: object;
  
  }
  
  export interface MiPerfilConfa{
    existeUsuario: boolean,
    usuarioNasfa: boolean,
    tipo_afi?:string;
    esDesempleadoParaServicio?:boolean;
    tipoUsuario?:string;
    
  }
  
  export interface Session{
    debeActualizarDatos?:boolean,
    debeRealizarValidacion?:boolean,
    puedeIngresar?:boolean,
    usuario?:User
    exitoso:boolean
  }
  export interface Token {
    token?: string;
    mensaje?: string;
  }
  
  export interface RememberPassword {
    documento: string;
    sistema: string;
    linkMensaje: string;
    parametro: string;
    remitente: string;
    asunto: string;
  }
  
  export interface ValidateToken {
    mensaje: string;
    valido: boolean;
    tipo: string;
  }
  export interface ValidateQuestion {
    respuesta: boolean;
    bloqueo:boolean;
    intentos:number;
    error:string;
    estado:number;
    debeActualizarDatos:boolean;
  
  }
  
  export interface UserOrCompany {
    documentType: string;
    document?: number;
    // dateBirthday: string;
    companyNit?: number;
    companyBranch?: string;
    mail?: string;
    nombreCompleto?: string;
  }
  
  export interface ServiceVerification {
    mensaje: string;
    servicioActivo: boolean;
  }
  