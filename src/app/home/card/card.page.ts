import { Component, OnInit } from '@angular/core';
import {SetService} from '../../services/set.service';
import {NavController, ToastController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit {

  constructor(private  readonly supabase: SetService, public toastController: ToastController,
              public navController: NavController, public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }

}
