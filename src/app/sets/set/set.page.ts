import { Component, OnInit } from '@angular/core';
import {Set} from '../../../datatypes/set';
import {SetService} from '../../services/set.service';
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-set',
  templateUrl: './set.page.html',
  styleUrls: ['./set.page.scss'],
})
export class SetPage implements OnInit {
  title = '';
  language = '';
  releaseYear = null;

  set: Set | undefined;
  constructor(private  readonly supabase: SetService, public toastController: ToastController,
              public navController: NavController) { }

  ngOnInit() {
  }

  //set.page
  async updateSet() {
    let errorMessage = '';
    try {
      if(this.title.length === 0){
        errorMessage += 'De naam van de set dient ingediend te zijn.\n';
      }
      if(this.language.length === 0){
        errorMessage += 'De taal dient ingevuld te zijn.\n';
      }
      if(this.releaseYear !== null){
          if(!parseInt(this.releaseYear, 10)){
            errorMessage += 'het jaar dient een numerieke waarde te zijn. \n';
          }
      }
      else { errorMessage += 'Het jaar dient ingevuld te zijn.\n';}
      if(errorMessage.length === 0){
        const {error} = await this.supabase.updateSet(this.title, this.language, this.releaseYear);
        this.navController.back();
      }
      else{
        await this.presentToast(errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  }


  async presentToast(errorMessage) {
    const toast = await this.toastController.create({
      message: errorMessage,
      duration: 3000
    });
    await toast.present();
  }

}
