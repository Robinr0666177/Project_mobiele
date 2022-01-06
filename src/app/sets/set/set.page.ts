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

  addUpdateButtonIsClickable = true;
  deleteButtonIsClickable = true;

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
    this.addUpdateButtonIsClickable = false;
    if(this.id === null) {
      this.createSet();
    } else {
      this.updateSet();
    }
  }

  async deleteSet(){
    this.deleteButtonIsClickable = false;
    const error = await this.supabase.deleteSet(this.id);
    console.log(error);
    this.navController.back();
  }

  //set.page
  async createSet() {
    let errorMessage = '';
    try {
      errorMessage = this.validateFields();
      if(errorMessage.length === 0){
        this.addUpdateButtonIsClickable = false;
        const {error} = await this.supabase.createSet(this.title, this.language, this.releaseYear);
        this.navController.back();
      }else{
        this.addUpdateButtonIsClickable = true;
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
        this.addUpdateButtonIsClickable = false;
          await this.supabase.updateSet({
          id: this.id,
          title: this.title,
          language: this.language,
            // eslint-disable-next-line @typescript-eslint/naming-convention
          release_year: this.releaseYear
        });
        this.navController.back();
      }else {
        this.addUpdateButtonIsClickable = true;
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
      if(this.releaseYear !== null && this.releaseYear.toString().length !== 0){
        if(this.releaseYear.toString().match(/^[1-9][0-9]*$/) === null){
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
