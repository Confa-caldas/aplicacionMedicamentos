import { Component} from '@angular/core';
import { LoadingComponent } from '../shared/loading/loading.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ModalContentComponent } from '../modal-content/modal-content.component';
import { LoginInternoComponent } from "../login-interno/login-interno.component";
import { CameraComponent } from "../camera/camera.component";
import { UtilitiesServiceService } from '../../services/utilities.service.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  standalone: true,
  imports: [LoadingComponent, CommonModule, RouterModule, ModalContentComponent, LoginInternoComponent, CameraComponent]
})
export class WelcomeComponent {
  bgimage: string = ".assets/img/bannerFormAppoiment.jpg";
  loading: boolean = false;
  public showWebcam = false;  

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
  
}