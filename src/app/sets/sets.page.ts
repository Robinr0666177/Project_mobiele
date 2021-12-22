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

  constructor(public supabase: SetService) {}

  ngOnInit() {
    //hier hoopte ik de sets terug op te halen na het toevoegen van een nieuwe
    // Deze methode wordt, zoals in les 7 gezien, enkel uitgevoerd na het initialiseren
    // van de component. Omdat je, voor het aanmaken van een nieuwe set, navigeert naar een
    // volgende pagina, blijft deze component in het navigation stack.
    // Je moet dus een lifecycle hook gebruiken die elke keer uitgevoerd wordt als de component
    // getoond wordt. Zoals de ionViewWillEnter lifecycle hook.
    this.sets = this.supabase.getSets();
  }

  logScrollStart(): void {
    this.buttonIsVisible = false;
  }

  logScrollEnd(): void {
    setTimeout(() => this.buttonIsVisible = true, 1500);
  }

  ionViewWillEnter(): void {
    this.sets = this.supabase.getSets();
  }
}
