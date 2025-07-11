import { Component, Input } from '@angular/core';
import {IonicModule, ModalController} from '@ionic/angular';
import {CommonModule} from "@angular/common";

import {addIcons} from "ionicons";
import {carSportOutline} from "ionicons/icons";
import {AutoData} from "../api/fahrzeuge.service";

@Component({
  selector: 'app-auto-detail-modal',
  templateUrl: './auto-detail-modal.component.html',
  styleUrls: ['./auto-detail-modal.component.scss'],
  standalone: true,
  imports: [CommonModule,IonicModule]
})
export class AutoDetailModalComponent {
  @Input() selectedAuto: AutoData | undefined;

  constructor(private modalController: ModalController) {
    addIcons({ carSportOutline });
  }

  closeModal() {
    this.modalController.dismiss().then(r => r);
  }
}

