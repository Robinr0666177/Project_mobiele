import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import{SupabaseClient, createClient} from '@supabase/supabase-js';
import {ISet} from '../../datatypes/ISet';


@Injectable({
  providedIn: 'root'
})
export class SetService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    //this.getSets();
  }

  //get methode om sets op te halen

  async getSets() {
    const {data, error} = await this.supabase
      .from('set')
      .select('title, language, release_year');
    return data;
  }

  //update set
  /**
   * The return type must be an array of ISet objects and must be
   * added to the method declaration. If this isn't done,
   * autocompletion or intellisense are not available.
   * @param id
   */
  async getSetById(id: number): Promise<ISet>{
    const {data, error} = await this.supabase
      // Add the datatype of the returned row(s) to the from
      // method.
      .from<ISet>('set')
      .select('title, language, release_year')
      .eq('id' ,id)
      // Add the single method when you expect a single row.
      // If you don't add this, the result will be an array.
      .single();
    return data;
  }

  async updateSet(updateSet: ISet): Promise<void> {
    const set = this.getSetById(updateSet.id);
    if(set !== undefined){
      await this.supabase.from('set').insert(set,  {
        returning: 'minimal', //
      });
    }else{
      return;
    }
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  async createSet(title, language, release_year) {
    const update: ISet = {
      title,
      language,
      // eslint-disable-next-line @typescript-eslint/naming-convention
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


}
