import { Component, OnInit } from '@angular/core';
import {environment} from '../../environments/environment';
import{SupabaseClient, createClient} from '@supabase/supabase-js';
import {CardService} from '../services/card.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  verticalButtonPosition = 'bottom';
  buttonIsVisible = true;
  cards = this.supabase.getCards();

  constructor(public supabase: CardService) {}

  ngOnInit() {
    this.cards = this.supabase.getCards();
  }

  logScrollStart(): void {
    this.buttonIsVisible = false;
  }

  logScrollEnd(): void {
    setTimeout(() => this.buttonIsVisible = true, 1500);
  }

  ionViewWillEnter(): void {
    this.cards = this.supabase.getCards();
  }
}
