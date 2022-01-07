import { Component, OnInit } from '@angular/core';
import {CardService} from '../services/card.service';
import {ToastController} from '@ionic/angular';
// import {ICard} from '../../datatypes/ICard';
// import {promise} from 'protractor';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  verticalButtonPosition = 'bottom';
  buttonIsVisible = true;
  cards = this.supabase.getCards();
  buttonIsClickable = true;

  constructor(public supabase: CardService, public toastController: ToastController) {}

  ngOnInit() {
    this.cards = this.supabase.getCards();

    //Ik heb ook geprobeerd om te kijken of promise geslaagd was, maar dat lukte ook niet

    // console.log('this.cards ' + this.cards);
    // if(this.cards === null){
    //   this.presentToast('Kaarten zijn niet opgehaald, kijk of je verbinding hebt, refresh de pagina dan');
    // }
  }

  // async presentToast(errorMessage) {
  //   const toast = await this.toastController.create({
  //     message: errorMessage,
  //     duration: 4000
  //   });
  //   await toast.present();
  // }

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
    this.cards = this.supabase.getCards();
  }
}
