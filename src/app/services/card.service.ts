import { Injectable } from '@angular/core';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {environment} from '../../environments/environment';
import {PermissionStatus} from '@capacitor/camera';
import {ISet} from '../../datatypes/ISet';
import {ICard} from '../../datatypes/ICard';
import {Itype} from '../../datatypes/Itype';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private supabase: SupabaseClient;

  //ik heb enkel photos nodig, ben niet zeker dat deze wel weg mag, al ik weet dat hier niets met foto's wordt gedaan
  private permissionGranted: PermissionStatus = {camera: 'granted', photos: 'granted'};

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async getCards(): Promise<ICard[]>{
    const {error,data} = await this.supabase
      .from('card')
      .select('id,name,card_number,type_id,set_id,description,condition,value,amount,image')
      .order('name',{ascending: true});
    console.log('error kaarten opahelen: ' + error);
    console.log('data kaarten: ' + data);
    // if(error !== null){
    //   data = null;
    // }
    return data;
  }

  async getCardById(id: number){
    const {data} = await this.supabase
      .from<ICard>('card')
      .select('id,name,card_number,type_id,set_id,description,condition,value,amount,image')
      .eq('id' ,id)
      .single();
    return data;
  }

  //type meegeven
  async getTypes(): Promise<Itype[]> {
    const {data} = await this.supabase
      .from('type')
      .select('id,name');
    return data;
  }

  //type meegeven
  async getSets(): Promise<ISet[]> {
    const {data} = await this.supabase
      .from('set')
      .select('id,title, language, release_year');
    return data;
  }

  async updateCard(updateCard: ICard){
    const card = await this.getCardById(updateCard.id);
    if(card !== undefined){
      const error = await this.supabase.from('card').upsert(updateCard,  {
        returning: 'minimal', //
      });
      return error;
    }
  }

  //ik ben zo dicht mogelijk gebleven met de benoemingen binnen supabase
  // eslint-disable-next-line @typescript-eslint/naming-convention
  async createCard(name: string, card_number: string ,type_id: number ,set_id: number ,
                   description: string ,condition: string ,value: number ,amount: number, image: string){
    const newCard: ICard = {
        name,
      // eslint-disable-next-line @typescript-eslint/naming-convention
        card_number,
      // eslint-disable-next-line @typescript-eslint/naming-convention
        type_id,
      // eslint-disable-next-line @typescript-eslint/naming-convention
        set_id,
        description,
        condition,
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
