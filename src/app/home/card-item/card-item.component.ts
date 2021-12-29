import { Component, OnInit, Input } from '@angular/core';
import {CardService} from '../../services/card.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ICard} from '../../../datatypes/ICard';

@Component({
  selector: 'app-card-item',
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.scss'],
})
export class CardItemComponent implements OnInit {

  @Input() card: ICard;

  constructor(public cardService: CardService, public router: Router, public activatedRoute: ActivatedRoute) { }

  ngOnInit() {}

}
