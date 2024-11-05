import { Component } from '@angular/core';
import { WelcomeComponent } from '../welcome/welcome.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [WelcomeComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
