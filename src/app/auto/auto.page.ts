import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import {ExploreContainerComponent} from "../explore-container/explore-container.component";

@Component({
  selector: 'app-auto',
  templateUrl: './auto.page.html',
  styleUrls: ['./auto.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ExploreContainerComponent]
})
export class AutoPage  {

  constructor() { }



}
