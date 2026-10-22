import { Component, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ModalContentComponent } from '../modal-content/modal-content.component';
import { LoginInternoComponent } from "../login-interno/login-interno.component";
import { UtilitiesServiceService } from '../../services/utilities.service.service';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, ModalContentComponent, LoginInternoComponent, FormsModule]
})
export class WelcomeComponent {
  bgimage: string = ".assets/img/bannerFormAppoiment.jpg";
  public showWebcam = false; 
  showPassword: boolean = false;
  username: string = '';
  password: string = '';
  nombreUsuario = '';
  inicioSesion = false;

  @ViewChild('loginInterno') loginInternoComponent!: LoginInternoComponent;


  constructor(
    private router: Router,
    public utilitiesService: UtilitiesServiceService
  ) {}

  ngOnInit() {
    if (this.utilitiesService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }


  registroFacial() {
    
    this.router.navigate(['/login-interno']);
  }

  closeModalFacial() {
    this.showWebcam = false;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  
  onLogin() {
    if (this.loginInternoComponent) {
      this.loginInternoComponent.onLogin(this.username, this.password);
    }
  }
  
  handleLoginSuccess() {
    this.router.navigate(['/home']);
  }

  iniciarSesion(){
    this.inicioSesion = true;
  }

}