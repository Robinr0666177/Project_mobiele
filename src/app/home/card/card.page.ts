import { Component, OnInit } from '@angular/core';
import {SetService} from '../../services/set.service';
import {NavController, ToastController} from '@ionic/angular';
import {Camera, CameraResultType, CameraSource, PermissionStatus, Photo} from '@capacitor/camera';
import {Capacitor} from '@capacitor/core';
import {ActivatedRoute} from '@angular/router';
import {ICard} from '../../../datatypes/ICard';
import {CardService} from '../../services/card.service';
import {TextZoom,SetOptions,GetResult} from'@capacitor/text-zoom';
import {CardImageService} from '../../services/card-image.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit {
  id? = null;
  name = '';
  cardNumber = null;
  typeId = null;
  setId? = null;
  description? = '';
  condition? ='';
  value? = null;
  amount?: null;
  image?: string;

  photo: Photo;

  card: ICard | undefined;

  verticalButtonPosition = 'bottom';
  buttonIsVisible = true;

  //ngfor werkt alleen bij arrays
  types = [];
  //dit werkt zeker niet
  sets = this.supabase.getSets();

  constructor(private  readonly supabase: CardService, public toastController: ToastController,
              public navController: NavController, public activatedRoute: ActivatedRoute
              ,public cardImageservice: CardImageService) { }

  async ngOnInit() {
    //hoe moet dit omgezet worden naar een array?
    this.types = await this.supabase.getTypes();
    this.sets = this.supabase.getSets();
  }

  //databaseoperations

  logScrollStart(): void {
    this.buttonIsVisible = false;
  }

  logScrollEnd(): void {
    setTimeout(() => this.buttonIsVisible = true, 2000);
  }

  async updateCard(){

  }

  async createCard()
  {
    let errorMessage = '';
    try {
      errorMessage = this.validateFields();
      console.log(errorMessage);
      if(errorMessage.length === 0){
        //deze methode moet de image property instellen
        await this.uploadPhoto();
        //voorlopig
        this.typeId = 1;
        this.setId = 1;
        const {error} = await this.supabase.createCard(this.name,this.cardNumber,this.typeId,this.setId,
                                                       this.description,this.condition,this.value,
                                                       this.amount,this.image);
        this.navController.back();
      }else{
        await this.presentToast(errorMessage);
      }
    } catch (error) {
      console.log(error);
    }
  }

  //image service methods

  async takePhoto() {
    this.photo = await this.cardImageservice.takePicture();
  }

  async uploadPhoto() {
    const filename = await this.cardImageservice.uploadPicture(this.photo, this.cardNumber);
    this.image = this.cardImageservice.getPublicURL(filename);
  }

  getDataUrl() {
    return `data:image/${this.photo?.format};base64,${this.photo.base64String}`;
  }

  //helper methods

  validateFields(){
    let errorMessage = '';
    console.log(errorMessage);
    if(this.name.length === 0){
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

  // async takePhoto(): Promise<string> {
  //   if (!this.haveCameraPermission() || !this.havePhotosPermission()) {
  //     await this.requestPermissions();
  //   }
  //
  //   let url ='';
  //
  //   if (Capacitor.isNativePlatform()) {
  //     url = await this.takePhotoNative();
  //   } else {
  //     url = await this.takePhotoPWA();
  //   }
  //   //deze url zou dan de image property moeten opvullen
  //   return url;
  // }


  // private async takePhotoPWA(): Promise<string> {
  //   const image = await Camera.getPhoto({
  //     quality: 90,
  //     resultType: CameraResultType.Base64,
  //     source: CameraSource.Camera
  //   });
  //
  //   /*//ik vermoed dat ik de image pas moet opslaan als ik deze wil opslaan in mijn supabase,
  //    dus bij de (toekomstige) methodes createCard en updateCard*/
  //
  //   // // Save the image to the filesystem and save the uri so that the image can be retrieved later.
  //   // const uri = await this.saveImageToFileSystem(image);
  //   // this.photoURIs.push(uri);
  //   // image.path = uri;
  //
  //   image.dataUrl = `data:image/${image.format};base64,${image.base64String}`;
  //   //ik geloof dat ik een string moet teruggeven om deze op te slaan als de property 'image' bij het maken of updaten van een kaart
  //   return image.dataUrl;
  // }



  // private havePhotosPermission(): boolean {
  //   return this.permissionGranted.photos === 'granted';
  // }
  //
  // private haveCameraPermission(): boolean {
  //   return this.permissionGranted.camera === 'granted';
  // }
  //
  // private determinePhotoSource(): CameraSource {
  //   if (this.havePhotosPermission() && this.haveCameraPermission()) {
  //     return CameraSource.Prompt;
  //   } else {
  //     return this.havePhotosPermission() ? CameraSource.Photos : CameraSource.Camera;
  //   }
  // }
  //
  // private async requestPermissions(): Promise<void> {
  //   try {
  //     this.permissionGranted = await Camera.requestPermissions({permissions: ['photos', 'camera']});
  //   } catch (error) {
  //     console.error(`Permissions aren't available on this device: ${Capacitor.getPlatform()} platform.`);
  //   }
  // }

}
