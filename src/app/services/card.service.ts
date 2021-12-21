import { Injectable } from '@angular/core';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {environment} from '../../environments/environment';
import {Camera, CameraResultType, CameraSource, PermissionStatus, Photo} from '@capacitor/camera';
import {ISet} from '../../datatypes/ISet';
import {ICard} from '../../datatypes/ICard';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private supabase: SupabaseClient;

  //ik heb enkel photos nodig
  private permissionGranted: PermissionStatus = {camera: 'granted', photos: 'granted'};

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async getCards(){
    const {data, error} = await this.supabase
      .from('card')
      .select('id,name,card_number,type_id,set_id,description,condition,value,amount,image');
    return data;
  }


  async getCardById(id: number){
    const {data, error} = await this.supabase
      .from<ISet>('card')
      .select('id,name,card_number,type_id,set_id,description,condition,value,amount,image')
      .eq('id' ,id)
      .single();
    return data;
  }

  async getTypes(){
    const {data, error} = await this.supabase
      .from('type')
      .select('id,name');
    return data;
  }

  async getSets(){
    const {data, error} = await this.supabase
      .from('set')
      .select('id,title, language, release_year');
    return data;
  }

  async updateCard(updateCard: ICard){
    const card = await this.getCardById(updateCard.id);
    if(card !== undefined){
      await this.supabase.from('card').upsert(updateCard,  {
        returning: 'minimal', //
      });
    }else{
      return;
    }
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  async createCard(name, card_number ,type_id ,set_id ,description ,condition ,value ,amount, image){
    const newCard: ICard = {
        name,
      // eslint-disable-next-line @typescript-eslint/naming-convention
        card_number,
      // eslint-disable-next-line @typescript-eslint/naming-convention
        type_id,
      // eslint-disable-next-line @typescript-eslint/naming-convention
        set_id,
        description,
        cardState: condition,
        value,
        amount,
        image
    };
    return this.supabase.from('card').upsert(newCard,{
      returning: 'minimal', //
    });
  }

  async deleteCard(id){
    const {error} = await this.supabase
      .from('card')
      .delete()
      .eq('id', id);
    return error;
  }


}
