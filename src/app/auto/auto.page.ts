import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Auto, AutoData, FahrzeugeService} from "../api/fahrzeuge.service";
import {IonicModule, ModalController} from "@ionic/angular";
import {AutoDetailModalComponent} from "../auto-detail-modal/auto-detail-modal.component";
import {IonicStorageModule} from "@ionic/storage-angular";
import {addIcons} from "ionicons";
import {arrowBackSharp, arrowForwardSharp, thermometerOutline} from "ionicons/icons";


@Component({
  selector: 'app-auto',
  templateUrl: './auto.page.html',
  styleUrls: ['./auto.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule, IonicModule, IonicStorageModule],
})
export class AutoPage  implements OnInit {
  autos: Auto | undefined| null;
  Marke:string="";
  Model: string="";
  currentPage: number = 1;
  selectedYear: number = 2020;
  availableYears: number[] = [
    2020, 2019, 2018, 2017, 2016, 2015
  ];

  HTTPError:{bool:boolean,message:string, code:number} = {bool: false, message: '', code:0}


  constructor(
    private fahrzeugeService: FahrzeugeService,
    private modalController: ModalController,
    private changeRef: ChangeDetectorRef,

  ) {
    addIcons({arrowForwardSharp, arrowBackSharp})
  }


  async  ngOnInit(): Promise<void> {
      await this.loadAutos();
  }
  async loadAutos() {
    await this.fahrzeugeService.ready(); // Storage initialisieren!
    const cacheKey = `autos_${this.selectedYear}_${this.Marke}_${this.Model}_${this.currentPage}`;
    const cachedAutos = await this.fahrzeugeService.get(cacheKey);
    if (await cachedAutos) {
      console.log('Daten aus dem Cache geladen.');
      this.autos = cachedAutos;
    } else {


      this.fahrzeugeService.getAutosWithAttributesAndEngine(this.selectedYear, this.Marke, this.Model, this.currentPage).subscribe(
        async (data) => {
          this.autos = data;
          await this.fahrzeugeService.set(cacheKey, data);
          console.log('Daten abgerufen und im Cache gespeichert.(Autos)');
        },
        (error) => {
          this.HTTPError.bool = true;
          this.HTTPError.message = error.message;
          console.error('Fehler beim Abruf:', error);

        }

      );
    }
    this.changeRef.detectChanges();
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

  async nextPage() {
    this.currentPage++;
    await this.loadAutos();
    console.log(this.currentPage);
  }
  async previousPage() {
    this.currentPage--;
    await this.loadAutos();
    console.log(this.currentPage);
  }

  protected readonly thermometerOutline = thermometerOutline;
}
