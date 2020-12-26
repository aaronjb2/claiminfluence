import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { WebSocketService } from '../web-socket.service';
const colorCodes = require('../../../resources/colorCodes.json');
const shapePaths = require('../../../resources/shapePaths.json');
const influences = require('../../../resources/influences.json');

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
  leftInfluence = "Error";
  rightInfluence = "Error";
  displayingInfluences = false;

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    this.colorCode = colorCodes[this.game.players[this.index].color];
    this.shapePath = shapePaths[this.game.players[this.index].shape];
    this.leftInfluence = influences[this.game.players[this.index].leftInfluence];
    this.rightInfluence = influences[this.game.players[this.index].rightInfluence];
  }

  ngOnChanges(): void {
    this.colorCode = colorCodes[this.game.players[this.index].color];
    this.shapePath = shapePaths[this.game.players[this.index].shape];
    this.leftInfluence = influences[this.game.players[this.index].leftInfluence];
    this.rightInfluence = influences[this.game.players[this.index].rightInfluence];
  }

  toggleChangingName() {
    this.changingName = !this.changingName;
  }

  toggleDisplayingInfluences() {
    this.displayingInfluences = !this.displayingInfluences;
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

  stopDisplayingInfluences() {
    this.displayingInfluences = false;
  }

  evaluateIfChallengeableActionExists() {
    if (this.game.phase === 2 || (this.game.phase > 3 && this.game.phase < 8) ||
    this.game.phase === 9 || this.game.phase === 20 || this.game.phase === 23) {
      return true;
    }
    return false;
  }

  challengeClaim() {
    this.game.challenger = this.index;
    if (this.game.phase === 2) {
      this.game.phase = 14;
    }
    if (this.game.phase === 4) {
      this.game.phase = 10;
    }
    if (this.game.phase === 9) {
      this.game.phase = 12;
    }
    if (this.game.phase === 5) {
      this.game.phase = 18;
    }
    if (this.game.phase === 6) {
      this.game.phase = 16;
    }
    if (this.game.phase === 20) {
      this.game.phase = 21;
    }
    if (this.game.phase === 23) {
      this.game.phase = 24;
    }
    if (this.game.phase === 7) {
      this.game.phase = 27;
    }
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
