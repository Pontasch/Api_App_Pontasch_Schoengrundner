import { Component } from '@angular/core';
import {IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { carSportSharp, bicycleSharp, sunny, moon } from 'ionicons/icons';
import {IonicModule} from "@ionic/angular";
import {RouterLink} from "@angular/router";
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonicModule, RouterLink],
})
export class TabsPage {
  isDark = false;

  constructor(private platform: Platform) {
    addIcons({ carSportSharp, bicycleSharp, sunny, moon });
    this.platform.ready().then(() => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      this.isDark = prefersDark.matches;
      this.setDarkMode(this.isDark);
      prefersDark.addEventListener('change', (mediaQuery) => {
        this.isDark = mediaQuery.matches;
        this.setDarkMode(this.isDark);
      });
    });
  }




  toggleDarkMode() {
    this.isDark = !this.isDark;
    this.setDarkMode(this.isDark);
  }

  setDarkMode(shouldEnable: boolean) {
    // Ionic dark palette: Klasse 'ion-palette-dark' auf <html> setzen/entfernen
    document.documentElement.classList.toggle('ion-palette-dark', shouldEnable);
  }
}
