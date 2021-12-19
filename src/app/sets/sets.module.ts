import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetsPageRoutingModule } from './sets-routing.module';

import { SetsPage } from './sets.page';
import {SetItemComponent} from './set-item/set-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetsPageRoutingModule
  ],
  declarations: [SetsPage, SetItemComponent]
})
export class SetsPageModule {}
