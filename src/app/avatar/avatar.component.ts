import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { WebSocketService } from '../web-socket.service';
const colorCodes = require('../../../resources/colorCodes.json');
const shapePaths = require('../../../resources/shapePaths.json')

@Component({
  selector: 'avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit, OnChanges {
  @Input() index: number;
  @Input() game;
  changingName: boolean = false;
  colorCode = 'white';
  shapePath = 'assets/images/square.jpg';

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    this.colorCode = colorCodes[this.game.players[this.index].color];
    this.shapePath = shapePaths[this.game.players[this.index].shape];
  }

  ngOnChanges(): void {
    this.colorCode = colorCodes[this.game.players[this.index].color];
    this.shapePath = shapePaths[this.game.players[this.index].shape];
  }

  toggleChangingName() {
    this.changingName = !this.changingName;
  }

  changeName(updatedName) {
    this.changingName = false;
    if (updatedName !== this.game.players[this.index].name) {
      this.game.players[this.index].name = updatedName;
      this.webSocketService.emit('update-game', this.game);
    }
  }

  changeToNextAvailableUpwardColor() {
    let found = false;
    let nextAvailableNum = this.game.players[this.index].color;
    while (!found) {
      nextAvailableNum = nextAvailableNum + 1;
      if (nextAvailableNum > colorCodes.length -1) {
        nextAvailableNum = 0;
      }
      if (!this.colorAlreadyExists(nextAvailableNum)) {
        found = true;
      }
    }
    this.game.players[this.index].color = nextAvailableNum;
    this.webSocketService.emit('update-game', this.game);
  }

  changeToNextAvailableDownwardColor() {
    let found = false;
    let nextAvailableNum = this.game.players[this.index].color;;
    while (!found) {
      nextAvailableNum = nextAvailableNum - 1;
      if (nextAvailableNum < 0) {
        nextAvailableNum = colorCodes.length -1;
      }
      if (!this.colorAlreadyExists(nextAvailableNum)) {
        found = true;
      }
    }
    this.game.players[this.index].color = nextAvailableNum;
    this.webSocketService.emit('update-game', this.game);
  }

  private colorAlreadyExists(colorNum) {
    for (let i = 0; i < this.game.players.length; i++) {
      if (this.game.players[i].color === colorNum) {
        return true;
      }
    }
    return false;
  }

  changeToNextAvailableUpwardShape() {
    let found = false;
    let nextAvailableNum = this.game.players[this.index].shape;
    while (!found) {
      nextAvailableNum = nextAvailableNum + 1;
      if (nextAvailableNum > shapePaths.length -1) {
        nextAvailableNum = 0;
      }
      if (!this.shapeAlreadyExists(nextAvailableNum)) {
        found = true;
      }
    }
    this.game.players[this.index].shape = nextAvailableNum;
    this.webSocketService.emit('update-game', this.game);
  }

  changeToNextAvailableDownwardShape() {
    let found = false;
    let nextAvailableNum = this.game.players[this.index].shape;;
    while (!found) {
      nextAvailableNum = nextAvailableNum - 1;
      if (nextAvailableNum < 0) {
        nextAvailableNum = shapePaths.length -1;
      }
      if (!this.shapeAlreadyExists(nextAvailableNum)) {
        found = true;
      }
    }
    this.game.players[this.index].shape = nextAvailableNum;
    this.webSocketService.emit('update-game', this.game);
  }

  private shapeAlreadyExists(shapeNum) {
    for (let i = 0; i < this.game.players.length; i++) {
      if (this.game.players[i].shape === shapeNum) {
        return true;
      }
    }
    return false;
  }
}
