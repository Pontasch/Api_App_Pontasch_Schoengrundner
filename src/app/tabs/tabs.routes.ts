import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'auto',
        loadComponent: () =>
          import('../auto/auto.page').then((m) => m.AutoPage),
      },
      {
        path: 'motorrad',
        loadComponent: () =>
          import('../motorrad/motorrad.page').then((m) => m.MotorradPage),
      },
      {
        path: '',
        redirectTo: 'auto',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/auto',
    pathMatch: 'full',
  },
];
