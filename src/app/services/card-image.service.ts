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
      source: CameraSource.Photos
    });
  }

  //deze methode oproepen bij create en update card
  async uploadPicture(photo: Photo, cardNumber: string) {
    const fileName = `${cardNumber.replace(' ','')}`  + photo.format;
    const { data, error } = await this.supabase
      .storage
      .from('card-image')
      .upload(`${fileName}`, decode(photo.base64String), {
        contentType: 'image/png'
      });
    return fileName;
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
