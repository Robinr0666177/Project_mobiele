import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NetworkComponent} from './network/network.component';
import {IonicModule} from '@ionic/angular';




@NgModule({
  declarations: [NetworkComponent],
  exports: [NetworkComponent],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class SharedModule { }
