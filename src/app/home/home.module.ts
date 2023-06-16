import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogComponent } from './log/log.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material';
import { ScrollingModule } from '@angular/cdk/scrolling';



@NgModule({
  declarations: [
    LogComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
    AngularMaterialModule,
    ScrollingModule
  ]
})
export class HomeModule { }
