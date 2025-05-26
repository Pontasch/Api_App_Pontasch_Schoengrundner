import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Auto, AutoData, FahrzeugeService} from "../api/fahrzeuge.service";
import {IonicModule, ModalController} from "@ionic/angular";
import {AutoDetailModalComponent} from "../auto-detail-modal/auto-detail-modal.component";
import {IonicStorageModule} from "@ionic/storage-angular";


@Component({
  selector: 'app-auto',
  templateUrl: './auto.page.html',
  styleUrls: ['./auto.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, IonicModule, IonicStorageModule]
})
export class AutoPage  implements OnInit {
  autos: Auto | undefined;
  Marke:string="";
  Model: string="";
  currentPage: number = 1;
  selectedYear: number = 2020;
  availableYears: number[] = [
    2020, 2019, 2018, 2017, 2016, 2015
  ];



  constructor(
    private fahrzeugeService: FahrzeugeService,
    private modalController: ModalController,
  ) {

  }


  async  ngOnInit(): Promise<void> {
      await this.loadAutos();
  }
  async loadAutos() {

    const cacheKey = `autos_${this.selectedYear}_${this.Marke}_${this.Model}_${this.currentPage}`;
    const cachedAutos = await this.fahrzeugeService.get(cacheKey);
    if (cachedAutos) {
      console.log('Daten aus dem Cache geladen.');
      this.autos = cachedAutos;
    } else {


      this.fahrzeugeService.getAutosWithAttributesAndEngine(this.selectedYear, this.Marke, this.Model).subscribe(
        async (data) => {
          this.autos = data;
          await this.fahrzeugeService.set(cacheKey, data);
          console.log('Daten abgerufen und im Cache gespeichert.(Autos)');
        },
        (error) => {
          console.error('Fehler beim Abruf:', error);
        }

      );
    }
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
