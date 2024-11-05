import { Component, OnInit } from '@angular/core';
import { ModalMessagesComponent } from '../modal-messages/modal-messages.component';

@Component({
  selector: 'app-modal-content',
  standalone: true,
  imports: [ModalMessagesComponent],
  templateUrl: './modal-content.component.html',
  styleUrl: './modal-content.component.css'
})
export class ModalContentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
