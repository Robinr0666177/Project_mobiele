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

  currentDateTime = '';

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

  async getCurrentDate(){
    const y= new Date().getFullYear().toString();
    const m = (new Date().getMonth() + 1).toString();
    const d =new Date().getUTCDate().toString();
    const h = new Date().getHours().toString();
    const mi = new Date().getMinutes().toString();
    const s = new Date().getSeconds().toString();
    return d + '-' + m + '-' + y + '-tijd-' + h + 'u-' + mi + 'm-' + s + 's';
  }

  //deze methode oproepen bij create en update card
  async uploadPicture(photo: Photo, condition: string, cardNumber: string, oldFileName: string, newfile: boolean) {
    await this.getCurrentDate();
    this.currentDateTime = await this.getCurrentDate();

    const fileName = cardNumber.replace(' ','') + '_staat='
                    + condition.replace(/\s|&|,|_|\/|\*|\?|;|:|=|\+|$/g, '') + '_datum='
                    + this.currentDateTime + '.' + photo.format;
    console.log(fileName);
    if(newfile === true){
      console.log('nieuw');
      await this.uploadPictureToBucket(photo, fileName);
    }else{
      if(oldFileName !== null){
        await this.deletePicture(oldFileName);
      }
      await this.uploadPictureToBucket(photo, fileName);
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

  async deletePicture(fileName: string){
    fileName = fileName.replace('https://lcipsdoqgsvpdeychwmr.supabase.co/storage/v1/object/public/card-image/','');
    console.log('image to delete ' + fileName);
    const { data, error } = await this.supabase
      .storage
      .from('card-image')
      .remove([`${fileName}`]);
    console.log('delete image:' +  error);
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
