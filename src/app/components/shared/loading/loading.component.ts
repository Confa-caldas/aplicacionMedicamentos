import { Component, OnInit } from '@angular/core';
import { UtilitiesServiceService } from '../../../services/utilities.service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent implements OnInit {

  constructor(
    public utilitiesService: UtilitiesServiceService
  ) { }

  ngOnInit(): void {}
}
