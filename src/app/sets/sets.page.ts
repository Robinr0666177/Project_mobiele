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
  sets = this.supabase.getSets();
  buttonIsClickable = true;

  constructor(public supabase: SetService) {}

  ngOnInit() {
    this.sets = this.supabase.getSets();
  }

  logScrollStart(): void {
    this.buttonIsVisible = false;
  }

  logScrollEnd(): void {
    setTimeout(() => this.buttonIsVisible = true, 1500);
  }

  logClicked(): void {
    this.buttonIsClickable = false;
  }

  ionViewWillEnter(): void {
    this.sets = this.supabase.getSets();
  }
}
