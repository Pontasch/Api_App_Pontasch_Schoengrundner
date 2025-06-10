import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import {provideHttpClient} from "@angular/common/http";
import {ModalController} from "@ionic/angular";
import {IonicStorageModule} from "@ionic/storage-angular";
import {importProvidersFrom} from "@angular/core";
import {Drivers} from "@ionic/storage";

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    importProvidersFrom(IonicStorageModule.forRoot(
      {
        name: 'Fahrzeuge',
        driverOrder: [Drivers.LocalStorage, Drivers.IndexedDB]
      }
    )),
    provideHttpClient(),
    importProvidersFrom(ModalController),
  ],

});
