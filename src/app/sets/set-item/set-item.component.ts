import {Component, Input, OnInit} from '@angular/core';
import {SetService} from '../../services/set.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ISet} from '../../../datatypes/ISet';

@Component({
  selector: 'app-set-item',
  templateUrl: './set-item.component.html',
  styleUrls: ['./set-item.component.scss'],
})
export class SetItemComponent implements OnInit {

  @Input() set: ISet;

  constructor(public setService: SetService, public router: Router, public activatedRoute: ActivatedRoute) { }

  ngOnInit() {}

}
