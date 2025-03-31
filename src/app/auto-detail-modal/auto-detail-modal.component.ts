import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar} from "@ionic/angular/standalone";

@Component({
  selector: 'app-auto-detail-modal',
  templateUrl: './auto-detail-modal.component.html',
  styleUrls: ['./auto-detail-modal.component.scss'],
  imports: [
    IonContent,
    IonButton,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader
  ]
})
export class AutoDetailModalComponent{
  @Input() selectedAuto: any;

  constructor(private modalController: ModalController) {}

  closeModal() {
    this.modalController.dismiss();
  }

}
