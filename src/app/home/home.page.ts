import { Component } from '@angular/core';
import {environment} from '../../environments/environment';
import{SupabaseClient, createClient} from '@supabase/supabase-js';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  verticalButtonPosition = 'bottom';
  buttonIsVisible = true;

  constructor() {}

  logScrollStart(): void {
    this.buttonIsVisible = false;
  }

  logScrollEnd(): void {
    setTimeout(() => this.buttonIsVisible = true, 1500);
  }

}
