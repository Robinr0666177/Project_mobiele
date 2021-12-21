import { Component, OnInit } from '@angular/core';
import {SetService} from '../../services/set.service';
import {NavController, ToastController} from '@ionic/angular';
import {Camera, CameraResultType, CameraSource, PermissionStatus, Photo} from '@capacitor/camera';
import {Capacitor} from '@capacitor/core';
import {ActivatedRoute} from '@angular/router';
import {ICard} from '../../../datatypes/ICard';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit {
  id? = null;
  title = '';
  cardNumber = null;
  typeId = null;
  setId? = null;
  description? = '';
  value? = null;
  amount?: null;
  image?: '';

  card: ICard | undefined;

  //de PermissionStatus dwingt om zowel toestemming te vragen voor het gebruik van de camera als de photos;
  // ik wil enkel foto's uit de opslag kunnen halen, ik wil geen foto's maken
  private permissionGranted: PermissionStatus = {camera: 'granted', photos: 'granted'};

  constructor(private  readonly supabase: SetService, public toastController: ToastController,
              public navController: NavController, public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  async updateCard(){
    //ik dacht ik uiteindelijk de methode takePhoto() op te roepen om de property 'image' op te vullen
  }

  async createCard()
  {
      //ik dacht ik uiteindelijk de methode takePhoto() op te roepen om de property 'image' op te vullen
  }


  validateFields(){
    let errorMessage = '';
    if(this.title.length === 0){
      errorMessage += 'De naam van de kaart dient ingediend te zijn.\n';
    }
    if(this.cardNumber.length === 0){
      errorMessage += 'De kaartcode dient ingevuld te zijn.\n';
    }
    if(this.typeId.match(/^[1-9][0-9]*$/) === null){
      errorMessage += 'De type van de kaart dient geselecteerd te zijn. \n';
    }

    return errorMessage;
  }

  async presentToast(errorMessage) {
    const toast = await this.toastController.create({
      message: errorMessage,
      duration: 3000
    });
    await toast.present();
  }


//photo operations


  async takePhoto(): Promise<string> {
    if (!this.haveCameraPermission() || !this.havePhotosPermission()) {
      await this.requestPermissions();
    }

    let url ='';

    if (Capacitor.isNativePlatform()) {
      url = await this.takePhotoNative();
    } else {
      url = await this.takePhotoPWA();
    }
    //deze url zou dan de image property moeten opvullen
    return url;
  }


  private async takePhotoPWA(): Promise<string> {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });

    /*//ik vermoed dat ik de image pas moet opslaan als ik deze wil opslaan in mijn supabase,
     dus bij de (toekomstige) methodes createCard en updateCard*/

    // // Save the image to the filesystem and save the uri so that the image can be retrieved later.
    // const uri = await this.saveImageToFileSystem(image);
    // this.photoURIs.push(uri);
    // image.path = uri;

    image.dataUrl = `data:image/${image.format};base64,${image.base64String}`;
    //ik geloof dat ik een string moet teruggeven om deze op te slaan als de property 'image' bij het maken of updaten van een kaart
    return image.dataUrl;
  }


  private async takePhotoNative(): Promise<string> {

    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Uri,
      saveToGallery: this.havePhotosPermission(),
      source: this.determinePhotoSource()
    });

    return image.dataUrl;
  }

  private havePhotosPermission(): boolean {
    return this.permissionGranted.photos === 'granted';
  }

  private haveCameraPermission(): boolean {
    return this.permissionGranted.camera === 'granted';
  }

  private determinePhotoSource(): CameraSource {
    if (this.havePhotosPermission() && this.haveCameraPermission()) {
      return CameraSource.Prompt;
    } else {
      return this.havePhotosPermission() ? CameraSource.Photos : CameraSource.Camera;
    }
  }

  private async requestPermissions(): Promise<void> {
    try {
      this.permissionGranted = await Camera.requestPermissions({permissions: ['photos', 'camera']});
    } catch (error) {
      console.error(`Permissions aren't available on this device: ${Capacitor.getPlatform()} platform.`);
    }
  }

}
