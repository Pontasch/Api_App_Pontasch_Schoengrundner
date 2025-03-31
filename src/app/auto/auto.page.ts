import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonContent, IonHeader, IonItem, IonList, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import {Auto, FahrzeugeService} from "../api/fahrzeuge.service";
import {ModalController} from "@ionic/angular";
import {AutoDetailModalComponent} from "../auto-detail-modal/auto-detail-modal.component";

@Component({
  selector: 'app-auto',
  templateUrl: './auto.page.html',
  styleUrls: ['./auto.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem,IonList]
})
export class AutoPage  implements OnInit {
  autos: Auto | undefined;

  constructor(
    private fahrzeugeService: FahrzeugeService,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.fahrzeugeService.getAutosWithAttributesAndEngine(2020).subscribe(
      (data) => {
        this.autos = data;
        console.log('Autos:', this.autos);
      },
      (error) => {
        console.error('Fehler beim Abrufen der Autos:', error);
      }
    );
  }

  async openModal(auto: any) {
    const modal = await this.modalController.create({
      component: AutoDetailModalComponent,
      componentProps: {
        selectedAuto: auto
      }
    });
    return await modal.present();
  }
}
