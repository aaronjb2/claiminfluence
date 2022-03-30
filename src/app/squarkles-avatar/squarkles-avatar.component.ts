import { Component, OnInit } from '@angular/core';
import { getColorCodeByIndex } from '../functions/getColorCodeByIndex';
import { getNthElementWithNonZeroValue } from '../functions/getNthElementWithNonZeroValue';
import { getTotalItemsWithNonZeroCost } from '../functions/getTotalItemsWithNonZeroCost';
import { getColorCost } from '../functions/getColorCost';
import { getCostColor } from '../functions/getCostColor';

@Component({
  selector: 'app-squarkles-avatar',
  templateUrl: './squarkles-avatar.component.html',
  styleUrls: ['./squarkles-avatar.component.scss']
})
export class SquarklesAvatarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  getColorCodeByIndex(index) { return getColorCodeByIndex(index); }

  getDoubleDigitTruthfulness(index) {
    return false;
  }

}
