import { Component, OnInit, Output, EventEmitter, HostListener, Input, PLATFORM_ID, Inject } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { WebcamModule, WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import $ from 'jquery';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [CommonModule, WebcamModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.css'
})
export class CameraComponent implements OnInit {
  width: number = 0;
  height: number = 0;
  returnUrl: string = "";
  formConsulta: FormGroup;
  @Input() mostrarBoton: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.formConsulta = this.formBuilder.group({});
    if (typeof navigator === 'undefined') {
      global.navigator = {} as any;
    }
    if (isPlatformBrowser(this.platformId)) {
      this.onResize();
    }
  }

  @Output() public pictureTaken = new EventEmitter<{
    webcamImage: WebcamImage;
    tipoConsulta: number;
  }>();

  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string = "";
  public tipoConsulta: number = 0;
  public videoOptions: MediaTrackConstraints = {};
  public errors: WebcamInitError[] = [];
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.requestCameraAccess();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.onResize();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: Event) {
    if (typeof window !== 'undefined') {
      const win = !!event ? (event.target as Window) : window;
      if (win.innerWidth < 768) {
        this.width = win.innerWidth /2;
        this.height = win.innerHeight - 20;
      } else if (win.innerWidth >= 768 && win.innerWidth <= 800) {
        this.width = win.innerWidth / 2;
        this.height = win.innerHeight / 2;
      } else {
        this.width = win.innerWidth / 4;
        this.height = win.innerHeight / 2;
      }
    }
  }

  requestCameraAccess() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.showWebcam = true;
        this.deviceId = stream.getVideoTracks()[0].getSettings().deviceId || '';
      })
      .catch(err => {
        console.error('No se pudo acceder a la cámara: ', err);
        const error: WebcamInitError = {
          message: 'No se pudo acceder a la cámara. Asegúrate de que el navegador tiene permisos.',
          mediaStreamError: err
        };
        this.errors.push(error);
        this.showWebcam = false;
      });
  }

  get f() {
    return this.formConsulta.controls;
  }

  createForm() {
    this.formConsulta = this.formBuilder.group({
      document: [
        '',
        [
          Validators.required,
          Validators.min(99999),
          Validators.max(999999999999999),
          Validators.pattern('^[0-9]+'),
        ],
      ],
    });
  }

  public triggerSnapshot(tipoConsulta: number): void {
    $('.btn-cerrar-facial').click();
    this.tipoConsulta = tipoConsulta;
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.pictureTaken.emit({
      webcamImage: webcamImage,
      tipoConsulta: this.tipoConsulta,
    });
  }

  public cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
}
