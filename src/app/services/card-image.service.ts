import { Injectable } from '@angular/core';
import {createClient} from '@supabase/supabase-js';
import {environment} from '../../environments/environment';
import {Camera, CameraResultType, CameraSource, PermissionStatus, Photo} from '@capacitor/camera';
import {Capacitor} from '@capacitor/core';
import {decode} from 'base64-arraybuffer';

@Injectable({
  providedIn: 'root'
})
export class CardImageService {

  private supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

  private permissionGranted: PermissionStatus = {camera: 'granted', photos: 'granted'};

  constructor() { }

  async takePicture(): Promise<Photo> {
    if (!this.havePhotosPermission()) {
      await this.requestPermissions();
    }
    return await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });
  }



  //deze methode oproepen bij create en update card
  async uploadPicture(photo: Photo, condition: string, cardNumber: string, oldFileName: string, newfile: boolean) {
    const fileName = `${cardNumber.replace(' ','')}_staat=${condition.replace(/\s|&|,|_|\/|\*|\?|;|:|=|\+|$/g, '')}.`+ photo.format;
    //zelf bij de update komt de methode hier terecht, terwijl daar de boolean van newfile op false wordt gezet
    if(newfile === true){
      console.log('foto: ' +  photo);
      await this.uploadPictureToBucket(photo, fileName);
    }else{
      //hier wil ik een check doen dat als de gegevens niet veranderen
      if(oldFileName === fileName){
        console.log('gelijk');
        await this.uploadPictureToBucket(photo, fileName);
      }else{
        //als er aan de gegevens iets wordt veranderd, dan heeft het geen zin om de oude afbeelding te laten staan
        console.log('niet gelijk');
        await this.deletePicture(oldFileName, photo);
        await this.uploadPictureToBucket(photo, fileName);
      }
    }
    return fileName;
  }

  //als alle gegevens van de kaart hezelfde blijven, dan zal de upsert ervoor zorgen dat er een update uitgevoerd wordt
  // en komt er geen extra kaart
  async uploadPictureToBucket(photo: Photo, fileName: string){
    const { data, error } = await this.supabase
      .storage
      .from('card-image')
      .upload(`${fileName}`, decode(photo.base64String), {
        contentType: 'image/png',
        upsert: true
      });
    console.log(error);
  }

  //ik weet niet hoe ik een afbeelding moet verwijderen
  async deletePicture(fileName: string,photo: Photo ){
    const { data, error } = await this.supabase
      .storage
      .from('card-image')
      .remove([`${decode(photo.base64String)}`]);
    console.log(error);
  }

  getPublicURL(filename) {
    const { publicURL, error } = this.supabase
      .storage
      .from('card-image')
      .getPublicUrl(filename);
    console.log(publicURL);
    return publicURL;
  }

  private havePhotosPermission(): boolean {
    return this.permissionGranted.photos === 'granted';
  }

  private async requestPermissions(): Promise<void> {
    try {
      this.permissionGranted = await Camera.requestPermissions({permissions: ['photos']});
    } catch (error) {
      console.error(`Permissions aren't available on this device: ${Capacitor.getPlatform()} platform.`);
    }
  }

}
