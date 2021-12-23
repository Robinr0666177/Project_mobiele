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
  typeId: number;
  //typeId: null;
  setId? = null;
  description? = '';
  condition? ='';
  value? = null;
  amount? = null;
  image? : string;

  photo: Photo;

  card: ICard | undefined;

  verticalButtonPosition = 'bottom';
  buttonIsVisible = true;

  types = [];
  sets = [];

  constructor(private  readonly supabase: CardService, public toastController: ToastController,
              public navController: NavController, public activatedRoute: ActivatedRoute
              ,public cardImageservice: CardImageService) { }

  async ngOnInit() {
    this.types = await this.supabase.getTypes();
    this.sets = await this.supabase.getSets();
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
        if(this.photo){
          await this.uploadPhoto();
          console.log('foto is niet null');
        }else {
          console.log('geen foto opgegeven');
        }
        console.log(this.typeId);
        const {error} = await this.supabase.createCard(this.name,this.cardNumber,this.typeId,this.setId,
                                                       this.description,this.condition,this.value,
                                                       this.amount,this.image);
        console.log(error);
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
    if(this.photo !== undefined){
      return `data:image/${this.photo?.format};base64,${this.photo.base64String}`;
    }
  }

  //helper methods

  validateFields(){
    let errorMessage = '';
    console.log(errorMessage);
    if(this.name.length === 0){
      errorMessage += 'De naam van de kaart dient ingediend te zijn.\n';
    }
    if(this.cardNumber === null){
      errorMessage += 'De kaartcode dient ingevuld te zijn.\n';
    }
    if(this.typeId.toString().match(/^[1-9][0-9]*$/) === null){
      errorMessage += 'De type van de kaart dient geselecteerd te zijn. \n';
    }
    if(this.setId !== null && this.setId.toString().match(/^[1-9][0-9]*$/) === null){
      errorMessage += 'Ongeldige set geselecteerd \n';
    }
    if(this.value !== null && this.value.toString().match(/^[1-9][0-9]*$/) === null){
      errorMessage += 'Waarde dient numeriek te zijn \n';
    }
    if(this.amount !== null && this.amount.toString().match(/^[1-9][0-9]*$/) === null){
      errorMessage += 'Waarde dient numeriek te zijn \n';
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
}
