import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import{SupabaseClient, createClient} from '@supabase/supabase-js';
import {Set} from '../../datatypes/set';


@Injectable({
  providedIn: 'root'
})
export class SetService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  //get methode om sets op te halen

  async getSets() {
    const {data, error} = await this.supabase
      .from('set')
      .select('title, language, release_year');
    return data;
  }

  //update set

  async updateSet(title, language, release_year) {
    const update: Set = {
      title,
      language,
      release_year
    };
    return this.supabase.from('set').upsert(update,  {
      returning: 'minimal', //
    });
  }

  async deleteSet(id) {
    this.supabase
      .from('set')
      .delete()
      .eq('id', id);
  }

  // async updateSet(set: Set) {
  //
  //   const update = {
  //     ...set,
  //     /*moet ik hier nog iets doen?*/
  //   };
  //
  //   return this.supabase.from('set').upsert(update,{
  //     returning:'minimal', //
  //   });
  // }



}
