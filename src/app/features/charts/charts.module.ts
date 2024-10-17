import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ChartsRoutingModule } from './charts-routing.module';
import { Parte1Component } from './parte1/parte1.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    Parte1Component
  ],
  imports: [
    CommonModule,
    ChartsRoutingModule,
    FormsModule
  ]
})
export class ChartsModule { }
