import { Component, OnInit } from '@angular/core';
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
  setId? = null;
  description? = '';
  condition ='';
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
    this.setData();
  }

  //setdata
  async setData(): Promise<void>{
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if(id === null){
      return;
    }
    this.id = parseInt(id, 10);
    const card = await this.supabase.getCardById(this.id);

    this.name = card.name;
    this.cardNumber = card.card_number;
    this.typeId = card.type_id;
    this.setId = card.set_id;
    this.description = card.description;
    this.condition = card.condition;
    this.value = card.value;
    this.amount = card.amount;
    this.image = card.image;
  }

  //toggle
  toggleCreateAndUpdate(): void {
    if(this.id === null) {
      this.createCard();
    } else {
      this.updateCard();
    }
  }

  //databaseoperations

  logScrollStart(): void {
    this.buttonIsVisible = false;
  }

  logScrollEnd(): void {
    setTimeout(() => this.buttonIsVisible = true, 2000);
  }


  async updateCard(){
    console.log('update wordt uitgevoerd')
      let errorMessage = '';
      try {
          errorMessage = this.validateFields();
          console.log(errorMessage);
          if(errorMessage.length === 0){
            //hier probeer ik de foto up te daten
            if(this.photo){
              await this.uploadPhoto(false);
            }
            await this.supabase.updateCard({
              id: this.id,
              name: this.name,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              card_number: this.cardNumber,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              type_id: this.typeId,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              set_id: this.setId,
              description: this.description,
              condition: this.condition,
              value: this.value,
              amount: this.amount,
              image: this.image,
            });
            this.navController.back();
          }else{
            await this.presentToast(errorMessage);
          }
      }catch (error){
        console.log(error);
      }
  }

  async createCard()
  {
    console.log('nieuwe kaart wordt gemaakt');
    let errorMessage = '';
    try {
      errorMessage = this.validateFields();
      console.log(errorMessage);
      if(errorMessage.length === 0){
        if(this.photo){
          await this.uploadPhoto(true);
          console.log('foto is niet null');
        }
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

  async uploadPhoto(newCard: boolean) {
    const oldFileName = newCard? null: this.image;
    console.log(oldFileName);
    const filename = await this.cardImageservice.uploadPicture(this.photo,this.condition, this.cardNumber, oldFileName, newCard);
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
    if(this.typeId === undefined || this.typeId.toString().match(/^[1-9][0-9]*$/) === null){
      errorMessage += 'De type van de kaart dient geselecteerd te zijn. \n';
    }
    if(this.setId !== null && this.setId.toString().match(/^[1-9][0-9]*$/) === null){
      errorMessage += 'Ongeldige set geselecteerd \n';
    }
    if(this.value !== null){
      if( this.value.toString().trim().replace(' ',null) !== '' && this.value.toString().trim().match(/^[1-9][0-9]*$/) === null){
        errorMessage += 'Waarde dient numeriek te zijn \n';
      }
    }
    if(this.amount !== null){
      if(this.amount.toString().trim().replace(' ',null) !== '' && this.amount.toString().match(/^[1-9][0-9]*$/) === null){
        errorMessage += 'Het aantal dient numeriek te zijn \n';
      }
    }
    if(this.condition.length === 0){
      errorMessage += 'De staat van de kaart dient ingevuld te zijn.\n';
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
