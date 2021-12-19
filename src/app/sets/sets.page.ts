import { Component, OnInit } from '@angular/core';
import {SetService} from '../services/set.service';

@Component({
  selector: 'app-sets',
  templateUrl: './sets.page.html',
  styleUrls: ['./sets.page.scss'],
})
export class SetsPage implements OnInit {

  verticalButtonPosition = 'bottom';
  buttonIsVisible = true;
  sets = this.setService.getSets();

  constructor(public setService: SetService) {}

  ngOnInit() {
  }

  logScrollStart(): void {
    this.buttonIsVisible = false;
  }

  logScrollEnd(): void {
    setTimeout(() => this.buttonIsVisible = true, 1500);
  }
}
