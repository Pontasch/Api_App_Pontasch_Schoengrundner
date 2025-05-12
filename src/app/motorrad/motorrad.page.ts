import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {FahrzeugeService, Motorraeder} from "../api/fahrzeuge.service";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-motorrad',
  templateUrl: './motorrad.page.html',
  styleUrls: ['./motorrad.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class MotorradPage implements OnInit {

  motorraeder: Motorraeder | undefined;
  Marke: string = "";
  Model: string = "";
  selectedYear: number = 2020;
  availableYears: number[] = [
    2020, 2019, 2018, 2017, 2016, 2015
  ];
  private modalController: any;

  constructor(
    private fahrzeugeService: FahrzeugeService
  ) {
  }

  ngOnInit(): void {
    this.loadMotorraeder();
  }

  loadMotorraeder() {
    this.fahrzeugeService.getMotorraeder(this.Marke).subscribe(
      (data) => {
        this.motorraeder = data;
      },
      (error) => {
        console.error('Fehler:', error);
      }
    );
  }
  async openModal(motorraeder: Motorraeder) {
    const modal = await this.modalController.create({
      component: MotorradPage,
      componentProps: {
        selectedMotorrad: motorraeder
      }
    });
    return modal.present();
  }
}
