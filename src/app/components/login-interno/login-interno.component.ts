import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WebcamModule, WebcamImage } from 'ngx-webcam';
import { AuthenticationService } from '../../services/authentication.service';
import { UtilitiesServiceService } from '../../services/utilities.service.service';
import { CameraComponent } from '../camera/camera.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import * as CryptoJS from 'crypto-js'
import $ from 'jquery';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-interno',
  standalone: true,
  imports: [CameraComponent, CommonModule, WebcamModule, RouterModule, FormsModule],
  templateUrl: './login-interno.component.html',
  styleUrl: './login-interno.component.css'
})
export class LoginInternoComponent implements OnInit {

  private idTransaccion: number = 0;
  nombreSistema = '';
  texto = '';
  titulo = '';
  private newTab: Window | null = null;
  myIP: string = '';
  public showWebcam = false;  
  nombreUsuario = '';
  username: string = '';
  password: string = '';

  @Output() loginCompleted = new EventEmitter<void>();

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    public utilitiesService: UtilitiesServiceService,
  ) { }

  ngOnInit(): void {
    this.consultarip();
  }

  consultarip() {
    this.authenticationService.consultarIp().subscribe((response: any) => {
      this.myIP = response.ip;
    });
  }

  public webcamImage: WebcamImage | undefined;
  handleImage(event: { webcamImage: WebcamImage; tipoConsulta: number }): void {
    this.webcamImage = event.webcamImage;
    if (event.tipoConsulta == 1) {
      this.validateFace();
    } else {
      this.cancelarInicioSesion();
    }
  }

  validateFace() {
  
      this.utilitiesService.loading = true;

      if (this.webcamImage) {
        this.authenticationService
          .inicioSesionInternoV2(this.webcamImage.imageAsBase64)
          .subscribe(
            (response: any) => {
              if (
                response.doc === 'No se identifico.' ||
                response.doc === 'error'
              ) {
                this.utilitiesService.loading = false;
                setTimeout(() => {
                  this.utilitiesService.showError('¡Ten presente!', response.doc);
                  $('.btn-modal-error').click();
                }, 500);
              } else {
                if (response.est) {
                  const estadoUsuario = response.est;
                  const numeroDocumento: String[] = response.doc
                    .toString()
                    .split('-');
                  if (numeroDocumento[0] != null && numeroDocumento[0] != '' && this.webcamImage) {
                    let bodySas = {
                      documento: numeroDocumento[0],
                    }
                    if (estadoUsuario) {
                      this.authenticationService.inicioSesionSas(bodySas).subscribe(
                        (response: any) => {
                          const estado = response.estado;
                          const respuesta = response.respuesta;
                          const nombre = response.nombre;
                          const token = response.token;
                          this.nombreUsuario = response.usuarioIngreso;
                          if(estado == 'Activo'){
                            this.loginExitoso(token, nombre, this.nombreUsuario);
                          }else{
                            setTimeout(() => {
                              this.utilitiesService.showError('¡Ten presente!', respuesta);
                              $('.btn-modal-error').click();
                            }, 500);
                          }
                        }
                      )
                      this.utilitiesService.loading = false;
                    } else {
                      this.utilitiesService.loading = false;
                      setTimeout(() => {
                        this.utilitiesService.showError('¡Ten presente!', response.mensaje);
                        $('.btn-modal-error').click();
                      }, 500);
                    }
                  }
                } else {
                  this.utilitiesService.loading = false;
                  setTimeout(() => {
                    this.utilitiesService.showError('¡Ten presente!', response.msg);
                    $('.btn-modal-error').click();
                  }, 500);
                }
              }
              
            },
            (error: any) => {
              this.utilitiesService.loading = true;
              setTimeout(() => {
                this.utilitiesService.showError('¡Ten presente!', error);
                $('.btn-modal-error').click();
              }, 500);
            }
          );
      }

    
  }

  closeModalFacial() {
    this.showWebcam = false;
  }

  loginExitoso(token: string, nombreUsuario: string, nombreUsuario2: string){
    this.utilitiesService.loading= false;
    this.utilitiesService.login(token, nombreUsuario, nombreUsuario2)
    this.router.navigate(['/home']);
  }

  cancelarInicioSesion() {
    this.router.navigate(['/']);      
  }

  openTab(): void {
    this.newTab = window.open('https://www.google.com', '_blank');
  }
  closeTab(): void {
    alert('prueba');
    window.open('', '_self')?.close();
  }

  goBack(): void { }

  xorEncryptDecrypt(input: string, key: string): string {
    let result = '';
    for (let i = 0; i < input.length; i++) {
      result += String.fromCharCode(
        input.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return result;
  }

  encriptarConfa(valor: string): string {
    return valor
      .replace(/1/g, 'Fb')
      .replace(/2/g, 'at')
      .replace(/4/g, 'VI')
      .replace(/6/g, 'pZ')
      .replace(/7/g, 'sH')
      .replace(/9/g, 'Dx')
      .replace(/3/g, 'Mo')
      .replace(/0/g, 'rQ');
  }

  onLogin(usuario: string, clave: string) {
    this.utilitiesService.loading = true;
    this.username = usuario;
    this.password = clave;
    
    if (this.username.trim() === '' || this.password.trim() === '') {
      this.utilitiesService.loading = false;
      setTimeout(() => {
        this.utilitiesService.showError('¡Ten presente!', 'Por favor, ingresa tu usuario y contraseña.');
        $('.btn-modal-error').click();
      }, 500);
      return;
    } else {
      const encryptedPassword = CryptoJS.SHA256(this.password).toString();
      const encryptedPasswordConfa = this.encriptarConfa(encryptedPassword);
  
      this.authenticationService.inicioSesionSasParametros(this.username, encryptedPasswordConfa).subscribe(
        (response: any) => {
          const estado = response.estado;
          const respuesta = response.respuesta;
          const nombre = response.nombre;
          const token = response.token;
          this.nombreUsuario = response.usuarioIngreso;
  
          if (estado == 'Activo') {
            this.utilitiesService.loading = false;
            this.loginExitoso(token, nombre, this.nombreUsuario);
            this.loginCompleted.emit();
          } else {
            this.utilitiesService.loading = false;
            setTimeout(() => {
              this.utilitiesService.showError('¡Ten presente!', respuesta);
              $('.btn-modal-error').click();
            }, 500);
          }
        }
      );
    }
  }

}
