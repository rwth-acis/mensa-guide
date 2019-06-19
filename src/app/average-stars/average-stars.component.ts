import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {range} from 'lodash';

@Component({
  selector: 'app-average-stars',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './average-stars.component.html',
  styleUrls: ['./average-stars.component.scss']
})
export class AverageStarsComponent implements OnInit {
  @Input() averageStars: number;
  min = Math.min;
  range = range;

  constructor() {
  }

  ngOnInit() {
  }

}
