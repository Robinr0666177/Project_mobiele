import {Component, Input, OnInit} from '@angular/core';
import {SetService} from '../../services/set.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Set} from '../../../datatypes/set';

@Component({
  selector: 'app-set-item',
  templateUrl: './set-item.component.html',
  styleUrls: ['./set-item.component.scss'],
})
export class SetItemComponent implements OnInit {

  @Input() set: Set;
  constructor(public setService: SetService, public router: Router, public activatedRoute: ActivatedRoute) { }

  ngOnInit() {}

}
