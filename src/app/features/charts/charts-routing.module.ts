import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Parte1Component } from './parte1/parte1.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'parte1',
        component: Parte1Component
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChartsRoutingModule { }
