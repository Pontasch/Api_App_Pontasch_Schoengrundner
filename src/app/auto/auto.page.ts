import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import {Auto, FahrzeugeService} from "../api/fahrzeuge.service";

@Component({
  selector: 'app-auto',
  templateUrl: './auto.page.html',
  styleUrls: ['./auto.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonLabel]
})
export class AutoPage  implements OnInit {
  autos: Auto | undefined;

  constructor(private fahrzeugeService: FahrzeugeService) {}
  ngOnInit(): void {
    this.fahrzeugeService.getAutosWithAttributes(2020).subscribe(
      (data) => {
        this.autos = data;
        console.log('Autos:', this.autos);
      },
      (error) => {
        console.error('Fehler beim Abrufen der Autos:', error);
      }
    );
  }
}
