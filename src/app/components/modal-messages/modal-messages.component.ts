import { Component, OnInit, Input } from '@angular/core';
import { UtilitiesServiceService } from '../../services/utilities.service.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from '../home/home.component';


@Component({
  selector: 'app-modal-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, HomeComponent],
  templateUrl: './modal-messages.component.html',
  styleUrl: './modal-messages.component.css'
})
export class ModalMessagesComponent implements OnInit {

  observacionesAplicacion = '';
  @Input() selectedMedicamento: any;

  constructor(
    public utilitiesService: UtilitiesServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
  ) {
    /* this.confirmUser(); */
  }

  ngOnInit() {
  }

  navigatecreditsimulador(){
    this.router.navigate(['/']);
  }

  reload(){
    window.location.reload()
  }

  guardarAplicacion(){
    console.log("Aplicando medicamento:", this.selectedMedicamento);
  }

  guardarImsumo(){
    console.log("guardando insumo:");
  }
}
