import { Routes } from '@angular/router';

export const content: Routes = [
  {
    path: 'series-fourier',
    loadChildren: () => import('../../features/charts/charts.module').then(m => m.ChartsModule)
  },

];
