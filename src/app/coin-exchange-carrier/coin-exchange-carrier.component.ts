import {Component, Input, OnInit} from '@angular/core';
import { getColorCodeByIndex } from '../functions/getColorCodeByIndex';
import { getNthElementWithNonZeroValue } from '../functions/getNthElementWithNonZeroValue';
import { getTotalItemsWithNonZeroCost } from '../functions/getTotalItemsWithNonZeroCost';
import { getColorCost } from '../functions/getColorCost';
import { getCostColor } from '../functions/getCostColor';
import {WebSocketService} from '../web-socket.service';

@Component({
  selector: 'app-coin-exchange-carrier',
  templateUrl: './coin-exchange-carrier.component.html',
  styleUrls: ['./coin-exchange-carrier.component.scss']
})
export class CoinExchangeCarrierComponent implements OnInit {
  @Input() elementIndex: number;
  @Input() game;

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {
  }

  getColorCodeByIndex() { return getColorCodeByIndex(this.elementIndex != null && this.elementIndex != undefined && this.elementIndex > -1 ? this.elementIndex : 0); }


}
