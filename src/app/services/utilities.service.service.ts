import { Injectable,  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Token } from '../interfaces/user.interface';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
  
})
export class UtilitiesServiceService {
    // Loading
  loading: boolean = false;
  messageLoading: string = "";

  //inactividad
  private readonly timeoutDuration = 420000; 
  private activityTimeout: any;
  inactivitySubject = new Subject<boolean>();

  private nombreUsuarioSource = new Subject<string>();
  nombreUsuario$ = this.nombreUsuarioSource.asObservable();

  // Modal
  messageTitleModal: string = "";
  messageModal: string = "";
  public showErrorModal: boolean = false;
  public showSuccessModal: boolean = false;
  show: boolean = false;

  //scanner
  private genericTokenSubject!: BehaviorSubject<Token>;
  public genericToken!: Observable<Token>;
  private currentTokenSubject!: BehaviorSubject<Token>;
  public currentToken!: Observable<Token>;

  //user
  public tokenKey = 'authToken';
  private userKey = 'nombreUsuario';
  private nombreUsuario = 'nombreUsuario2';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    
    
  ) {
    if (this.isBrowser()) {
      this.startTimer();
      this.setActivityListeners();
    }
  }

  //Métodos para el Scanner
  private loadTokens() {
    let gtoken =
      this.cookieService.get("gtoken") !== ""
        ? JSON.parse(this.cookieService.get("gtoken"))
        : "";
    this.genericTokenSubject = new BehaviorSubject<Token>(gtoken);
    this.genericToken = this.genericTokenSubject.asObservable();

    let ptoken =
      this.cookieService.get("ptoken") !== ""
        ? JSON.parse(this.cookieService.get("ptoken"))
        : "";
    this.currentTokenSubject = new BehaviorSubject<Token>(ptoken);
    this.currentToken = this.currentTokenSubject.asObservable();
  }

  public get genericTokenValue(): Token {
    return this.genericTokenSubject.value;
  }

  public get currentTokenValue(): Token {
    return this.currentTokenSubject.value;
  }

  private getQuery(query: string, bodyContent: any, token: string) {
    const url = `${environment.apiIngresoConfa}${query}`;
    const body = bodyContent;

    /* const tk =  JSON.parse(this.cookieService.get("gtoken"))
    console.log(tk) */

    let reqHeader = new HttpHeaders({
      'Authorization': token
    });

    return this.http.post(url, body, { headers: reqHeader });
  }

  getGenericToken() {
    let genericToken = {
      parametro1: `${environment.parametro1}`,
      parametro2: `${environment.parametro2}`,
      parametro3: "Web",
    };

    return this.getQuery("auth", genericToken, "").pipe(
      map((response: Token) => {

        if (response.token) {
          this.cookieService.set(
            "gtoken",
            JSON.stringify(response),
            1,
            "/",
            undefined,
            false,
            "Strict"
          );

          this.genericTokenSubject.next(response);
        }
        return response;
      })
    );
  }

  public getData(document: number, token: string) {

    let bodyUser = {
      documento: document.toString(),
    };


    return this.getQuery("confa/metodo33", bodyUser, token).pipe(
      map((response) => {
        // console.log(Object.values(response))
        return Object.values(response);
      })
    );
  }

  // Métodos para mostrar u ocultar los modales
  showError(messageTitle: string, message: string) {
    this.showErrorModal = true;
    this.messageTitleModal = messageTitle;
    this.messageModal = message;
  }

  showSuccess(messageTitle: string, message: string) {
    this.showSuccessModal = true;
    this.messageTitleModal = messageTitle;
    this.messageModal = message;
  }

  

  hideModals() {
    this.showErrorModal = false;
    this.showSuccessModal = false;
  }

  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  login(token: string, nombreUsuario: string, nombreUsuario2: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.userKey, nombreUsuario);
      localStorage.setItem(this.nombreUsuario, nombreUsuario2);
      this.emitirNombreUsuario(nombreUsuario); 
    }
  }

  isAuthenticated(): boolean {
    if (this.isBrowser()) {
      return !!localStorage.getItem(this.tokenKey);
    }
    return false;  
  }

  getNombreUsuario(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem(this.userKey);
    }
    return null;
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
      this.emitirNombreUsuario('');
    }
  }

  limpiarDatos(){
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

 
  startTimer() {
    clearInterval(this.activityTimeout); // Limpia cualquier intervalo previo.
    this.activityTimeout = setInterval(() => {
      this.checkInactivity();
    }, 1000); // Chequea cada segundo.
  }

  checkInactivity() {
    const lastActivity = Number(localStorage.getItem('lastActivity') || Date.now());
    const currentTime = Date.now();
  
    if (currentTime - lastActivity > this.timeoutDuration) {
      this.inactivitySubject.next(true); // Notifica inactividad.
      this.stopTimer(); // Detén el temporizador.
    }
  }

  resetTimer() {
    localStorage.setItem('lastActivity', Date.now().toString()); // Actualiza la última actividad.
  }

  setActivityListeners() {
    ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach((event) => {
      window.addEventListener(event, () => this.resetTimer());
    });
  
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.resetTimer(); // Reinicia el temporizador si la aplicación vuelve al frente.
      }
    });
  }
  
  stopTimer() {
    clearInterval(this.activityTimeout);
  }

  emitirNombreUsuario(nombre: string) {
    this.nombreUsuarioSource.next(nombre);
  }


}
