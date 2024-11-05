import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UtilitiesServiceService } from '../app/services/utilities.service.service';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { LoginInternoComponent } from './components/login-interno/login-interno.component';
import { HttpClientModule } from '@angular/common/http';
import { MainComponent } from './components/main/main.component';
import { ModalContentComponent } from './components/modal-content/modal-content.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { LoadingComponent } from './components/shared/loading/loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, WelcomeComponent, LoginInternoComponent, HttpClientModule, MainComponent, ModalContentComponent, HeaderComponent, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sasAngular';
  loading: boolean = false;
  public bgimage : String = "assets/img/bannerFormAppoiment.jpg";

  constructor(
    public utilitiesService: UtilitiesServiceService
  ) { }

  onActivate(event: any){
    console.log(event);
  }

}
