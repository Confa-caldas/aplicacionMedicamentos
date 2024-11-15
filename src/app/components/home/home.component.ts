import { Component, ViewChild, OnInit  } from '@angular/core';
import { first } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { UtilitiesServiceService } from '../../services/utilities.service.service';
import { Token } from '../../interfaces/user.interface';
import { InformacionPaciente } from '../../models/informacion-paciente';
import { CommonModule, Time } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendarAlt, faTasks, faPills, faBoxOpen, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { ModalMessagesComponent } from '../modal-messages/modal-messages.component';
import { RouterModule, Router } from '@angular/router';
import Swal from 'sweetalert2';
import $ from 'jquery';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, CommonModule, FontAwesomeModule, ModalMessagesComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  template: `
    <div *ngIf="!isTimeoutCompleted">Esperando...</div>
    <div *ngIf="isTimeoutCompleted">¡Redirigiendo al login!</div>
  `,
})
export class HomeComponent implements OnInit {

  @ViewChild("input", { static: true }) input: any;

  faCalendarAlt = faCalendarAlt;
  faTasks = faTasks;
  faPills = faPills;
  faBoxOpen = faBoxOpen;
  faUserEdit = faUserEdit;
  isTimeoutCompleted = false;

  constructor(
    private router: Router,
    private utilitiesService: UtilitiesServiceService,
    private cookieService: CookieService,
    private auth: AuthenticationService,
  ) {
  }

  

  availableDevices!: MediaDeviceInfo[];
  currentDevice!: MediaDeviceInfo;
  hasPermission!: boolean;
  activar!: boolean;
  inputFocused = false;

  mostrarMedicamentos: boolean = false;
  mostrarInfoMedicamento: boolean = false;
  mostrarMensaje: boolean = false;
  mostrarDatosBasicos: boolean = false;
  mostrarInfoInsumos: boolean = false;
  mostrarSelectSAB: boolean = false;
  mostrarCargarSAB: boolean = true;
  MedicamentoSelect = false;
  medicamento = ''
  hora!: Time;
  dosis = 0;

  modalExito = false;
  mensaje = ''

  inputValue!: string
  data = [];
  dataPlaneacion = [];
  dataVerAplicaciones = []
  dataGuardar = []
  datosPaciente: InformacionPaciente[] = [];
  nombre: string = '';
  apellido: string = '';
  categoria = '';
  infdocumento = '';
  fechaNacimiento = '';
  sexo = '';
  plan = '';
  convenio = '';
  cama = '';
  tipoDocumento = '';
  codigoSab = ''
  tipoNumeroDocumento = this.tipoDocumento + "/ " + this.infdocumento;
  selectedMedicamento: any;
  selectedMedicamentoModal = {
    nombreMedicamento: '',
    dosis: '',
    nombreUnidadAdministracion: '',
    nombreViaAdministracion: '',
    nombreIndicacionEspecial: '',
    frecuencia: '',
    unidadTiempo: '',
    origenMedicamento: '',
    estadoOrden: '',
    observacionEnfermeria: '',
    primerHorarioNoAplicado: '',
    aplicar: false,
    noAplicar: '',
    observacion: '',
    cantidadAplicado: 0,
    cantidadDevolucion: '',
    cantidadNoAplicado: '',
    cantidadPorAplicacion: 0,
    cantidadTotal: 0,
    causaNoAplicacion: '',
    horaPlaneadaAplicacion: '',
    idOrden: '',
    indicacionEspecial: '',
    medicamento: '',
    nombreUnidadTiempo: '',
    numItem: '',
    observacionAplicacion: '',
    prefijo: '',
    secOrdenamiento: '',
    unidadAdministracion: '',
    viaAdministracion: '',
    nombreCausaNoAplicacion:'',
    descontarOrden: true
};
selectedMedicamentoPlaneacion: any;
admisionNumero = '';
nombreUsuario = '';

medicamentosPlaneados = [
  {
    prefijo: '',
    medicamento: '',
    nombreMedicamento: '',
    viaAdmin: '',
    frecuencia: 0,
    dosis: 0,
    unidadMedida: '',
    origen: '',
    fechaFormulacion: '',
    observaciones: '',
    horasPlaneacion: []
  }
];

aplicaciones = [
  {
    fechaAplicacion: '',
    horaAplicacion: '',
    usuarioAplica: '',
    aplicado: '',
    observaciones: '',
    nombreCausaNoAplica: '',
    horaPlaneacion: ''
  }

];

medicamentos = [
  {
    nombreMedicamento: 'Paracetamol',
    dosis: '500mg',
    nombreUnidadAdministracion: '',
    nombreViaAdministracion: 'Oral',
    nombreIndicacionEspecial: 'Tomar con alimentos',
    frecuencia: 'Cada 8 horas',
    unidadTiempo: 'Horas',
    origenMedicamento: 'Farmacia interna',
    estadoOrden: 'Pendiente',
    observacionesEnfermeria: '',
    primerHorarioNoAplicado: '08:00',
    aplicar: false,
    noAplicar: '',
    observacion: '',
    cantidadAplicado: '',
    cantidadDevolucion: '',
    cantidadNoAplicado: '',
    cantidadPorAplicacion: '',
    cantidadTotal: '',
    causaNoAplicacion: '',
    horaPlaneadaAplicacion: '',
    idOrden: '',
    indicacionEspecial: '',
    medicamento: '',
    nombreUnidadTiempo: '',
    numItem: '',
    observacionAplicacion: '',
    prefijo: '',
    secOrdenamiento: '',
    unidadAdministracion: '',
    viaAdministracion: ''
  }
];

insumos = [
  {
    nombreInsumo: 'ejemplo',
    cantidad: 16,
    cantidadUsado: 5,
    cantidadAUsar: 11
  }
];

causasNoAplicacion = [
  {
    id: '',
    nombre: ''
  }
];

sabOptions = [
  {
    sab: '',
    sabNuevo: '',
    descripcionSab: ''
  }
];

datosSab = [
  {
    pacienteNombre: '',
    pacienteIdentificacion: '',
    habCama: '',
    admisionNumero: '',
    respuesta: ''
  }
];

noDatosSab = false;
datosSabBoolean = false;
selectedSab: any;


ngOnInit(): void {
  this.inputFocused = true;
  this.utilitiesService.inactivitySubject.subscribe((expired: boolean) => {
    if (expired) {
      this.iniciarSesion()
      $('.btn-modal-inactividad').click();
    }
  });
}



obteberCuasaNoAplicacion(medicamento: any) {
  medicamento.nombreCausaNoAplicacion = this.causasNoAplicacion.find(causa => causa.id === medicamento.causaNoAplicacion)?.nombre;
  console.log("id: ", medicamento.causaNoAplicacion , " nombre: ", medicamento.nombreCausaNoAplicacion);
}

toggleAplicar(medicamento: any) {

  medicamento.aplicar = true;
  medicamento.causaNoAplicacion = '';
  console.log("medi toggle", medicamento)
  this.openAplicarModal(medicamento);
  
}

toggleNoAplicar(medicamento: any) {
  medicamento.aplicar = false;
  this.obteberCuasaNoAplicacion(medicamento);
}

selectMedicamento(medicamento: any) {
  this.selectedMedicamento = medicamento;
  this.selectedMedicamentoModal = medicamento;
}

selectMedicamentoPlaneacion(planeacion: any){
  this.selectedMedicamentoPlaneacion = planeacion;
}


openAplicarModalprueba() {

  $('.btn-modal-aplicar').click();
 
}

openAplicarModal(medicamento: any) {

  console.log(medicamento.indicacionEspecial)
  this.selectedMedicamentoModal.nombreMedicamento = medicamento.nombreMedicamento;
  this.selectedMedicamentoModal.dosis = medicamento.dosis;
  this.selectedMedicamentoModal.nombreUnidadAdministracion = medicamento.nombreUnidadAdministracion;
  this.selectedMedicamentoModal.nombreViaAdministracion = medicamento.nombreViaAdministracion;
  this.selectedMedicamentoModal.frecuencia = medicamento.frecuencia;
  this.selectedMedicamentoModal.nombreIndicacionEspecial = medicamento.nombreIndicacionEspecial;
  this.selectedMedicamentoModal.origenMedicamento = medicamento.origenMedicamento;
  this.selectedMedicamentoModal.observacionAplicacion = medicamento.observacionAplicacion;
  this.selectedMedicamentoModal.causaNoAplicacion = medicamento.causaNoAplicacion;
  this.selectedMedicamentoModal.aplicar = medicamento.aplicar;
  this.selectedMedicamentoModal.secOrdenamiento = medicamento.secOrdenamiento;
  this.selectedMedicamentoModal.numItem = medicamento.numItem;
  this.selectedMedicamentoModal.prefijo = medicamento.prefijo;
  this.selectedMedicamentoModal.medicamento = medicamento.medicamento;
  this.selectedMedicamentoModal.unidadAdministracion = medicamento.unidadAdministracion;
  this.selectedMedicamentoModal.viaAdministracion = medicamento.viaAdministracion;
  this.selectedMedicamentoModal.indicacionEspecial = medicamento.indicacionEspecial;
  this.selectedMedicamentoModal.cantidadTotal = medicamento.cantidadTotal;
  this.selectedMedicamentoModal.cantidadPorAplicacion = medicamento.cantidadPorAplicacion;
  this.selectedMedicamentoModal.cantidadAplicado = medicamento.cantidadAplicado;
  this.selectedMedicamentoModal.cantidadNoAplicado = medicamento.cantidadNoAplicado;
  this.selectedMedicamentoModal.idOrden = medicamento.idOrden;
  this.selectedMedicamentoModal.estadoOrden = medicamento.estadoOrden;
  this.selectedMedicamentoModal.horaPlaneadaAplicacion = medicamento.horaPlaneadaAplicacion;
  this.selectedMedicamentoModal.descontarOrden = true;
  this.selectedMedicamentoModal.observacionEnfermeria = medicamento.observacionEnfermeria;
    
  console.log("medicamento modal aplicar ",this.selectedMedicamentoModal);  

  $('.btn-modal-aplicar').click();
 
}

openInsumosModal(insumos: any) {
  console.log(insumos)

  let token = localStorage.getItem('authToken');
  let nombre2 = localStorage.getItem('nombreUsuario2');
  if(nombre2){
    this.nombreUsuario = nombre2;
  }
  if (token != null) {
    this.auth.guardarInsumo(token, this.admisionNumero, this.nombreUsuario, insumos, this.codigoSab).subscribe((response: any) => {
      if (response.estado == 'OK') {
        this.utilitiesService.loading = false;
        console.log(response);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Guardada con éxito",
          showConfirmButton: false,
          timer: 1500
        });
        this.obtenerDatosPaciente(this.infdocumento);
      } else {
        this.utilitiesService.loading = false;
        this.utilitiesService.showError('No se pudo guardar el insumo:', response.mensaje);
        $('.btn-modal-error').click();
      }
    },
      (error) => {
        this.utilitiesService.loading = false;
        this.utilitiesService.showError('Error en la llamada al servicio:', error);
        $('.btn-modal-error').click();
      })
  } else {
    this.utilitiesService.loading = false;
    this.utilitiesService.showError('Token inválido:', 'El token expiró, por favor inicia sesión nuevamente');
    $('.btn-modal-error').click();
    this.iniciarSesion();
  }



  $('.btn-modal-insumos').click();
}

openVerAplicaciones(){
  let token = localStorage.getItem('authToken');
  console.log("Token ver aplicaciones: ", token)
    if (token != null) {
      this.auth.obtenerAplicaciones(this.admisionNumero, token, this.selectedMedicamento.prefijo, this.selectedMedicamento.medicamento, this.codigoSab).subscribe((response: any) => {
        if (this.auth.esTokenValidoAplicaciones(response)) {
          this.utilitiesService.loading = false;
          this.dataVerAplicaciones = Object.values(response)
          this.aplicaciones = this.dataVerAplicaciones [0];
          console.log("data ver aplicaciones: ",this.dataVerAplicaciones);
          console.log("data ver aplicaciones llenada : ",this.aplicaciones);
        } else {
          this.utilitiesService.loading = false;
          this.utilitiesService.showError('Token inválido:', 'El token expiró, por favor inicia sesión nuevamente');
          $('.btn-modal-error').click();
          this.iniciarSesion();
        }
      },
        (error) => {
          this.utilitiesService.loading = false;
          this.utilitiesService.showError('Error en la llamada al servicio:', error);
          $('.btn-modal-error').click();
        })
    } else {
      this.utilitiesService.loading = false;
      this.utilitiesService.showError('Token inválido:', 'El token expiró, por favor inicia sesión nuevamente');
      $('.btn-modal-error').click();
      this.iniciarSesion();
    }
  $('.btn-modal-ver-aplicaciones').click();
}

noDescontarOrden(){
  this.selectedMedicamentoModal.descontarOrden = false;
  this.generarAplicacion();
}

descontarOrden(){
  this.selectedMedicamentoModal.descontarOrden = true;
  this.generarAplicacion()
}

guardarAplicacion(){
  if((this.selectedMedicamentoModal.causaNoAplicacion === 'CM-4' && this.selectedMedicamentoModal.observacionAplicacion === '') ||  (this.selectedMedicamentoModal.aplicar === false && this.selectedMedicamentoModal.causaNoAplicacion === '')){
    this.utilitiesService.loading = false;
    this.utilitiesService.showError('¡Faltan datos ! ingresar una observación', '');
    $('.btn-modal-error').click();
  }else{
    if(this.selectedMedicamentoModal.nombreIndicacionEspecial == 'Multidosis ampolla' && this.selectedMedicamentoModal.cantidadAplicado > 0 && this.selectedMedicamentoModal.cantidadAplicado < this.selectedMedicamentoModal.cantidadTotal && this.selectedMedicamentoModal.aplicar == true){
      $('.btn-modal-multidosis').click();
    } 
    else{
      if(this.selectedMedicamentoModal.nombreIndicacionEspecial == 'Multidosis ampolla' && this.selectedMedicamentoModal.cantidadAplicado == this.selectedMedicamentoModal.cantidadTotal){
        this.selectedMedicamentoModal.descontarOrden = false;
      }
      this.generarAplicacion()
    }
  } 
}

generarAplicacion() {
  
    let token = localStorage.getItem('authToken');
    let nombre2 = localStorage.getItem('nombreUsuario2');
    if(nombre2){
      this.nombreUsuario = nombre2;
    }
    if (token != null) {
      this.auth.guardarAplicacion(token, this.admisionNumero, this.nombreUsuario, this.selectedMedicamentoModal, this.codigoSab).subscribe((response: any) => {
        if (response.estado == 'OK') {
          this.utilitiesService.loading = false;
          console.log(response);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Guardada con éxito",
            showConfirmButton: false,
            timer: 1500
          });
          this.obtenerDatosPaciente(this.infdocumento);
        } else if(response.estado == 'ERROR_YA_EXISTE'){
            this.utilitiesService.showError('No se guardó la aplicación:', response.mensaje);
            $('.btn-modal-error').click();
            this.obtenerDatosPaciente(this.infdocumento);
          }else {
          this.utilitiesService.loading = false;
          this.utilitiesService.showError('No se guardó la aplicación:', response.mensaje);
          $('.btn-modal-error').click();
        }
      },
        (error) => {
          this.utilitiesService.loading = false;
          this.utilitiesService.showError('Error en la llamada al servicio:', error);
          $('.btn-modal-error').click();
        })
    } else {
      this.utilitiesService.loading = false;
      this.utilitiesService.showError('Token inválido:', 'El token expiró, por favor inicia sesión nuevamente');
      $('.btn-modal-error').click();
      this.iniciarSesion();
    }
}

CancelarGuardarAplicacion(){
  this.selectedMedicamentoModal.aplicar =false;
  this.selectedMedicamentoModal.causaNoAplicacion = '';
}

increase(insumo: any) {
  if (insumo.cantidadAUsar < (insumo.cantidad - insumo.cantidadUsado)) {
    insumo.cantidadAUsar++;
  }
}

decrease(insumo: any) {
  if (insumo.cantidadAUsar > 0) {
    insumo.cantidadAUsar--;
  }
}

increaseMedicamentos(medicamento: any) {
  if (medicamento.cantidadPorAplicacion < (medicamento.cantidadTotal - medicamento.cantidadAplicado - medicamento.cantidadNoAplicado)) {
    medicamento.cantidadPorAplicacion++;
  }
}

decreaseMedicamentos(medicamento: any) {
  if (medicamento.cantidadPorAplicacion > 0) {
    medicamento.cantidadPorAplicacion--;
  }
}

obtenerDatosPaciente(document:string){
  let token = localStorage.getItem('authToken');
  this.mostrarSelectSAB = false;
  this.mostrarCargarSAB = false;
    if (token) {
      this.auth.obtenerPaciente(document, token).subscribe((response: any) => {
        if (this.auth.esTokenValido(response)) {
          this.utilitiesService.loading = false;
          this.data = Object.values(response)
          this.inputValue = ''
          console.log(this.data);
          this.admisionNumero = this.data[9];
          this.llenarDatosPaciente();
          if(this.nombre != ''){
            this.auth.obtenerPlaneacion(this.admisionNumero, token, this.codigoSab).subscribe((response: any) => {
              if (this.auth.esTokenValidoPlaneacion(response)) {
                this.utilitiesService.loading = false;
                this.dataPlaneacion = Object.values(response)
                this.inputValue = ''
                console.log(this.dataPlaneacion);
                this.llenarDatosPlaneacion();
                this.mostrarDatosBasicos = true;
              } else {
                this.utilitiesService.showError('Token inválido:', 'El token expiró, por favor inicia sesión nuevamente');
                $('.btn-modal-error').click();
                this.router.navigate(['/']);
                this.iniciarSesion();
              }
            },
              (error) => {
                this.utilitiesService.loading = false;
                this.utilitiesService.showError('Error en la llamada al servicio:', error);
                $('.btn-modal-error').click();
              })
          }else{
            this.utilitiesService.showError('Esta persona no está en admisión', '');
              $('.btn-modal-error').click();
          }
          
        } else {
          this.utilitiesService.loading = false;
          this.utilitiesService.showError('Token inválido:', 'El token expiró, por favor inicia sesión nuevamente');
          $('.btn-modal-error').click();
          this.router.navigate(['/']);
          this.iniciarSesion();
        }
      },
        (error) => {
          this.utilitiesService.loading = false;
          this.utilitiesService.showError('Error en la llamada al servicio:', error);
          $('.btn-modal-error').click();
        })
    } else {
      this.utilitiesService.loading = false;
      this.utilitiesService.showError('Token inválido:', 'El token expiró, por favor inicia sesión nuevamente');
      $('.btn-modal-error').click();
      this.router.navigate(['/']);
      this.iniciarSesion();
    }
}

activarScanner() {
  //this.utilitiesService.loading = true
  this.mostrarSelectSAB = false;
  this.mostrarCargarSAB = false;
  this.datosSabBoolean = false;
  if (this.inputValue != undefined) {
    const datosQR = this.inputValue.split("-");
    const document = (datosQR[0]);
    
    this.obtenerDatosPaciente(document);
    
  } else {
    this.utilitiesService.loading = false;
    this.utilitiesService.showError('Documento inválido:', 'Documento inválido, por favor inténtalo de nuevo');
    $('.btn-modal-error').click();
  }
}

llenarDatosPaciente(){
  this.codigoSab = this.data[0];
  this.admisionNumero = this.data[9];
  this.nombre = this.data[6];
  this.cama = this.data[8]
  this.tipoDocumento = this.data[12];
  this.fechaNacimiento = this.data[11];
  this.sexo = this.data[10];
  this.convenio = this.data[3] + "  " + this.data[1];
  this.plan = this.data[2];
  this.infdocumento = this.data[4];
  this.insumos = this.data[13];
  this.tipoNumeroDocumento = this.tipoDocumento + "  " + this.infdocumento;
  this.medicamentos = this.data[14];
  this.causasNoAplicacion = this.data[15];

  console.log("medicamentos llenados: ",this.medicamentos);

}

llenarDatosPlaneacion(){
  this.medicamentosPlaneados = this.dataPlaneacion[0]

}

mostrarTablaInsumos() {
  this.mostrarInfoInsumos = !this.mostrarInfoInsumos;
}

iniciarSesion() {
  this.utilitiesService.logout();
  this.router.navigate(['/']); 
}

cargarSAB(){
  this.mostrarSelectSAB = true;
  this.utilitiesService.loading = true;
  let token = localStorage.getItem('authToken');
    
    if (token != null) {
      this.auth.obtenerSab(token).subscribe((response: any) => {
        if (!this.auth.esTokenInvalido(response)) {
          this.utilitiesService.loading = false;
          this.data = Object.values(response)
          this.sabOptions = this.data;     
        } else {
          this.utilitiesService.loading = false;
          this.utilitiesService.showError('Error:', 'No fue posible cargar el sab');
          $('.btn-modal-error').click();
        }
      },
        (error) => {
          this.utilitiesService.loading = false;
          this.utilitiesService.showError('Error en la llamada al servicio:', error);
          $('.btn-modal-error').click();
        })
    } else {
      this.utilitiesService.loading = false;
      this.utilitiesService.showError('Token inválido:', 'El token expiró, por favor inicia sesión nuevamente');
      $('.btn-modal-error').click();
      this.router.navigate(['/']);
      this.iniciarSesion();
    }
}

onSabChange() {  
  if (this.selectedSab) {
    this.utilitiesService.loading = true;
    let token = localStorage.getItem('authToken');
    if (token != null) {
      this.auth.obtenerDatosSAB(token, this.selectedSab).subscribe((response: any) => {
        if (response !== 'No hay admisiones') {
          this.utilitiesService.loading = false;
          this.data = Object.values(response)
          this.datosSab = this.data;
          this.datosSabBoolean = true;
        }else{
          this.utilitiesService.loading = false;
          this.noDatosSab = true;
        }
      },
        (error) => {
          this.utilitiesService.loading = false;
          this.utilitiesService.showError('Error en la llamada al servicio:', error);
          $('.btn-modal-error').click();
        })
    } else {
      this.utilitiesService.loading = false;
      this.utilitiesService.showError('Token inválido:', 'El token expiró, por favor inicia sesión nuevamente');
      $('.btn-modal-error').click();
      this.router.navigate(['/']);
      this.iniciarSesion();
    }
  }
}

obtenerDatosPacienteSAB(document:string){
  let token = localStorage.getItem('authToken');
    
    if (token != null) {
      this.auth.obtenerPaciente(document, token).subscribe((response: any) => {
        if (this.auth.esTokenValido(response)) {
          this.utilitiesService.loading = false;
          this.data = Object.values(response)
          this.inputValue = ''
          console.log(this.data);
          this.admisionNumero = this.data[9];
          this.llenarDatosPaciente(); 
          this.auth.obtenerPlaneacion(this.admisionNumero, token, this.codigoSab).subscribe((response: any) => {
            if (this.auth.esTokenValidoPlaneacion(response)) {
              this.utilitiesService.loading = false;
              this.dataPlaneacion = Object.values(response)
              this.inputValue = ''
              console.log(this.dataPlaneacion);
              this.llenarDatosPlaneacion();
            } 
          },
            (error) => {
              this.utilitiesService.loading = false;
              this.utilitiesService.showError('Error en la llamada al servicio:', error);
              $('.btn-modal-error').click();
            })         
        } else {
          this.utilitiesService.loading = false;
          this.utilitiesService.showError('Error:', 'No se pudo cargar los medicamentos');
          $('.btn-modal-error').click();
        }
      },
        (error) => {
          this.utilitiesService.loading = false;
          this.utilitiesService.showError('Error en la llamada al servicio:', error);
          $('.btn-modal-error').click();
        })
    } else {
      this.utilitiesService.loading = false;
      this.utilitiesService.showError('Token inválido:', 'El token expiró, por favor inicia sesión nuevamente');
      $('.btn-modal-error').click();
      this.router.navigate(['/']);
      this.iniciarSesion();
    }
}

verMedicamentos(documento: string) {
  console.log("abrir pdf")
  this.obtenerDatosPacienteSAB(documento);
  $('.btn-modal-medicamentos').click();
}


}
