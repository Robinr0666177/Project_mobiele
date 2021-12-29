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
    if(newfile){
      await this.uploadPictureToBucket(photo, fileName);
    }else{
      if(oldFileName === fileName){
        await this.uploadPictureToBucket(photo, fileName);
      }else{
        //als er aan de gegevens iets wordt veranderd, dan heeft het geen zin om de oude afbeelding te laten staan
        await this.deletePicture(oldFileName);
        await this.uploadPictureToBucket(photo, fileName);
      }
    }
    return fileName;
  }

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

  async deletePicture(fileName: string){
    const { data, error } = await this.supabase
      .storage
      .from('card-image')
      .remove([`${fileName}`]);
    console.log(error);
  }

  getPublicURL(filename) {
    const { publicURL, error } = this.supabase
      .storage
      .from('cards')
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
