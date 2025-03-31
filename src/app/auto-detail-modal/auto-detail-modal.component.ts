import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {CommonModule} from "@angular/common";
import {IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar} from "@ionic/angular/standalone";

@Component({
  selector: 'app-auto-detail-modal',
  templateUrl: './auto-detail-modal.component.html',
  styleUrls: ['./auto-detail-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent]
})
export class AutoDetailModalComponent {
  @Input() selectedAuto: any;

  constructor(private modalController: ModalController) {}

  closeModal() {
    this.modalController.dismiss().then(r => r);
  }
}
