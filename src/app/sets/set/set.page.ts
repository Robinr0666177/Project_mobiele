import { Component, OnInit } from '@angular/core';
import {ISet} from '../../../datatypes/ISet';
import {SetService} from '../../services/set.service';
import { ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-set',
  templateUrl: './set.page.html',
  styleUrls: ['./set.page.scss'],
})
export class SetPage implements OnInit {
  id? = null;
  title = '';
  language = '';
  releaseYear = null;

  set: ISet | undefined;
  constructor(private  readonly supabase: SetService, public toastController: ToastController,
              public navController: NavController, public activatedRoute: ActivatedRoute) { }

  ngOnInit(): void{
    this.setData();
  }


  // You have retrieved data asynchronously, thus
  // the method should be async.
  async setData(): Promise<void> {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if(id === null){
      return;
    }

    this.id = parseInt(id, 10);

    const set = await this.supabase.getSetById(this.id);
    this.title = set.title;
    this.language = set.language;
    this.releaseYear = set.release_year;
  }

  toggleCreateAndUpdate(): void {
    if(this.id === undefined) {
      this.createSet();
    } else {
      this.updateSet();
    }

  }

  //set.page
  async createSet() {
    let errorMessage = '';
    try {
      errorMessage = this.validateFields();
      if(errorMessage.length === 0){
        const {error} = await this.supabase.createSet(this.title, this.language, this.releaseYear);
        this.navController.back();
      }else{
        await this.presentToast(errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateSet() {
    let errorMessage = '';
    try {
      errorMessage = this.validateFields();
      if(errorMessage.length === 0){
        //kan geen const {error} zetten
          await this.supabase.updateSet({
          id: this.id,
          title: this.title,
          language: this.language,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          release_year: this.releaseYear
        });
        this.navController.back();
      }else {
        await this.presentToast(errorMessage);
      }
    }catch (error){
      console.log(error);
    }
  }

  validateFields(){
    let errorMessage = '';
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
      return errorMessage;
  }

  async presentToast(errorMessage) {
    const toast = await this.toastController.create({
      message: errorMessage,
      duration: 3000
    });
    await toast.present();
  }

}
