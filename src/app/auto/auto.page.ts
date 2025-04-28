import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Auto, AutoData, FahrzeugeService} from "../api/fahrzeuge.service";
import {IonicModule, ModalController} from "@ionic/angular";
import {AutoDetailModalComponent} from "../auto-detail-modal/auto-detail-modal.component";

@Component({
  selector: 'app-auto',
  templateUrl: './auto.page.html',
  styleUrls: ['./auto.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, IonicModule]
})
export class AutoPage  implements OnInit {
  autos: Auto | undefined;

  selectedYear: number = 2020; // Standardjahr
  availableYears: number[] = [
    2020, 2019, 2018, 2017, 2016, 2015
  ];


  constructor(
    private fahrzeugeService: FahrzeugeService,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.loadAutos();
  }
  loadAutos() {
    this.fahrzeugeService.getAutosWithAttributesAndEngine(this.selectedYear).subscribe(
      (data) => {
        this.autos = data;
      },
      (error) => {
        console.error('Fehler:', error);
      }
    );
  }

  async openModal(auto: AutoData) {
    const modal = await this.modalController.create({
      component: AutoDetailModalComponent,
      componentProps: {
        selectedAuto: auto
      }
    });
    return modal.present();
  }
}
