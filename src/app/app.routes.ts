import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'auto',
    loadComponent: () => import('./auto/auto.page').then( m => m.AutoPage)
  },
  {
    path: 'motorrad',
    loadComponent: () => import('./motorrad/motorrad/motorrad.page').then( m => m.MotorradPage)
  },
];
