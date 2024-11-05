import { Component, OnInit } from '@angular/core';
import {UtilitiesServiceService} from '../../../services/utilities.service.service';
import { WelcomeComponent } from '../../welcome/welcome.component';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [WelcomeComponent, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  public bgimage : String = "assets/img/bannerFormAppoiment.jpg";
  nombreUsuario: string | null = null;
  isLoggedIn = false; 
  constructor(
    private router: Router,
    public utilitiesService: UtilitiesServiceService,
  
  ) {
   
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && localStorage.getItem('nombreUsuario')) {
      this.nombreUsuario = localStorage.getItem('nombreUsuario') || '';
    }
    this.utilitiesService.nombreUsuario$.subscribe(nombre => {
      this.nombreUsuario = nombre;
    });
  }

  logout(): void {
    this.isLoggedIn = false; 
    this.utilitiesService.logout();
    this.router.navigate(['/']);
  }
}
