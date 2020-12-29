import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { WebSocketService } from '../web-socket.service';
import { animate, style, transition, trigger } from '@angular/animations';
const colorCodes = require('../../../resources/colorCodes.json');
const shapePaths = require('../../../resources/shapePaths.json');
const influences = require('../../../resources/influences.json');

@Component({
  selector: 'avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  animations: [
    trigger('flyInOut', [
      transition('void => *', [
        style({transform: 'translateY(-100px)'}),
        animate('1s')
      ]),
      transition('* => void', [
        animate('1s', style({transform: 'translateY(100px)'}))
      ])
    ]),
    trigger('departLeftInfluence', [
      transition('* => void', [
        animate('1s', style({transform: 'translateX(-100px)'}))
      ])
    ]),
    trigger('arriveLeftInfluence', [
      transition('void => *', [
        style({transform: 'translateY(100px)'}),
        animate('1s')
      ])
    ]),
    trigger('departRightInfluence', [
      transition('* => void', [
        animate('1s', style({transform: 'translateX(100px)'}))
      ])
    ]),
    trigger('arriveRightInfluence', [
      transition('void => *', [
        style({transform: 'translateY(100px)'}),
        animate('1s')
      ])
    ])
  ]
})
export class AvatarComponent implements OnInit, OnChanges {
  @Input() index: number;
  @Input() game;
  changingName: boolean = false;
  colorCode = 'white';
  shapePath = 'assets/images/square.jpg';
  leftInfluence = 'Error';
  rightInfluence = 'Error';
  displayingInfluences = false;
  showDiv = false;
  toggleDiv() {
    this.showDiv = !this.showDiv;
  }

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

  isChallenged() {
    return (this.game.phase === 10 || this.game.phase === 12 || this.game.phase === 14 || this.game.phase === 16
      || this.game.phase === 18 || this.game.phase === 21 || this.game.phase === 24 || this.game.phase === 27)
      && this.index === this.game.actionPerformer;
  }

  getChallengedInfluence() {
    return this.game.phase === 10 || this.game.phase === 12 ? 'Duke' :
      this.game.phase === 14 || this.game.phase === 16 ? 'Captain' :
        this.game.phase === 18 || this.game.phase === 21 ? 'Ambassador' :
          this.game.phase === 24 ? 'Assassin' : 'Contessa';
  }

  evaluateIfGameIsOver() {
    let alivePlayers = 0;
    for (let i = 0; i < this.game.players.length; i++) {
      if (this.game.players[i].leftInfluenceAlive || this.game.players[i].rightInfluenceAlive) {
        alivePlayers = alivePlayers + 1;
      }
    }
    if (alivePlayers < 2) {
      return true;
    }
    return false;
  }

  getNextAlivePlayer(playerIndex) {
    let playerFound = false;
    let indexOfNextPlayer = playerIndex;
    while (!playerFound) {
      indexOfNextPlayer = indexOfNextPlayer + 1;
      if (indexOfNextPlayer > this.game.players.length) {
        indexOfNextPlayer = 0;
      }
      if (this.game.players[indexOfNextPlayer].leftInfluenceAlive || this.game.players[indexOfNextPlayer].rightInfluenceAlive) {
        playerFound = true;
      }
    }
    return indexOfNextPlayer;
  }

  getNewRandomInfluence(playerInfluenceNumber) {
    const arr = [];
    for (let i = 0; i < 15; i++) {
      if (!this.someoneAlreadyHasInfluence(i) || playerInfluenceNumber === i) {
        arr.push(i);
      }
    }
    return arr[Math.floor(Math.random() * arr.length)];
  }

  someoneAlreadyHasInfluence(influenceNumber) {
    for (let i = 0; i < this.game.players.length; i++) {
      if (this.game.players[i].leftInfluence === influenceNumber || this.game.players[i].rightInfluence === influenceNumber) {
        return true;
      }
    }
    return false;
  }

  revealInfluenceInResponseToChallenge(leftInfluence) {
    const playerInfluenceNumber = leftInfluence ? this.game.players[this.index].leftInfluence : this.game.players[this.index].rightInfluence;
    const playerInfluence = influences[playerInfluenceNumber];
    if (playerInfluence === this.getChallengedInfluence()) {
      const newRandomInfluence = this.getNewRandomInfluence(playerInfluenceNumber);
      this.game.departingInfluence = playerInfluence;
      this.game.influenceActionNumber = leftInfluence ? this.getLeftDepartInfluenceNumber() : this.getLeftDepartInfluenceNumber();
      if (leftInfluence) {
        this.game.players[this.index].leftInfluence = newRandomInfluence;
      } else {
        this.game.players[this.index].rightInfluence = newRandomInfluence;
      }
      if (!this.game.players[this.game.challenger].leftInfluenceAlive || !this.game.players[this.game.challenger].rightInfluenceAlive || this.game.phase === 24) {
        console.log('did not want to be in here')
        this.game.players[this.game.challenger].leftInfluenceAlive = false;
        this.game.players[this.game.challenger].rightInfluenceAlive = false;
        if (this.evaluateIfGameIsOver()) {
          console.log('in evaluate if game is over evaluated to true')
          this.game.started = false;
          this.game.challenger = -1;
          this.game.actionPerformer = -1;
          this.game.actionRecipient = -1;
          this.game.phase = 1;
          this.game.influenceActionNumber = -1;
          this.game.departingInfluence = -1;
        } else if (this.game.challenger === this.game.turn) {
          this.game.turn = this.getNextAlivePlayer(this.game.turn);
          if (this.game.phase === 14) {
            this.game.phase = 3;
            this.game.challenger = -1;
          } else if (this.game.phase === 21) {
            this.game.phase = 30;
          } else {
            this.game.phase = 1;
            this.game.actionRecipient = -1;
            this.game.actionPerformer = -1;
            this.game.challenger = -1;
          }
        }
      } else {
        this.game.phase = this.game.phase + 1;
        this.game.onlyOneCoin = false;
      }
    } else {
      if (leftInfluence) {
        this.game.players[this.index].leftInfluenceAlive = false;
      } else {
        this.game.players[this.index].rightInfluenceAlive = false;
      }
      if (this.evaluateIfGameIsOver()) {
        this.game.started = false;
        this.game.phase = 1;
      } else if (!this.game.players[this.index].leftInfluenceAlive && !this.game.players[this.index].rightInfluenceAlive && this.game.turn === this.index) {
        this.game.turn = this.getNextAlivePlayer(this.index);
        this.game.phase = 1;
        this.game.challenger = -1;
        this.game.actionPerformer = -1;
        this.game.actionRecipient = -1;
      } else {
        if (this.game.phase === 10) {
          this.game.players[this.index].coins = this.game.players[this.index].coins - 3;
          this.game.actionPerformer = -1;
          this.game.phase = 1;
        }
        if (this.game.phase === 12) {
          this.game.players[this.game.actionPerformer].coins = this.game.players[this.game.actionPerformer].coins + 2;
          this.game.actionPerformer = -1;
          this.game.phase = 1;
        }
        if (this.game.phase === 14) {
          this.game.players[this.index].coins = this.game.onlyOneCoin ? this.game.players[this.index].coins - 1 : this.game.players[this.index].coins - 2;
          this.game.players[this.game.actionRecipient].coins = this.game.onlyOneCoin ? this.game.players[this.game.actionRecipient].coins + 1 : this.game.players[this.game.actionRecipient].coins + 2;
          this.game.phase = 1;
        }
        if (this.game.phase === 16 || this.game.phase === 18) {
          this.game.players[this.index].coins = this.game.onlyOneCoin ? this.game.players[this.index].coins - 1 : this.game.players[this.index].coins - 2;
          this.game.players[this.game.actionPerformer].coins = this.game.onlyOneCoin ? this.game.players[this.game.actionPerformer].coins + 1 : this.game.players[this.game.actionPerformer].coins + 2;
          this.game.actionPerformer = -1;
          this.game.actionRecipient = -1;
          this.game.phase = 1;
        }
        if (this.game.phase === 21) {
          this.game.turn = this.getNextAlivePlayer(this.index);
          this.game.actionPerformer = -1;
          this.game.phase = 1;
        }
        if (this.game.phase === 24) {
          this.game.players[this.index].coins = this.game.players[this.index].coins + 3;
          this.game.turn = this.getNextAlivePlayer(this.index);
          this.game.actionPerformer = -1;
          this.game.actionRecipient = -1;
          this.game.phase = 1;
        }
        if (this.game.phase === 27) {
          this.game.players[this.index].leftInfluenceAlive = false;
          this.game.players[this.index].rightInfluenceAlive = false;
          if (this.evaluateIfGameIsOver()) {
            this.game.started = false;
          } else {
            if (this.game.turn === this.index) {
              this.game.turn = this.getNextAlivePlayer(this.index);
            }
          }
          this.game.actionPerformer = -1;
          this.game.actionRecipient = -1;
          this.game.phase = 1;
        }
      }
    }
    this.game.onlyOneCoin = false;
    this.webSocketService.emit('update-game', this.game);
  }

  getLeftDepartInfluenceNumber() {
    return this.index * 4;
  }

  getLeftArriveInfluenceNumber() {
    return this.index * 4 + 1;
  }

  getRightDepartInfluenceNumber() {
    return this.index * 4 + 2;
  }

  getRightArriveInfluenceNumber() {
    return this.index * 4 + 3;
  }

  selectInfluenceToLoseForIncorrectlyChallenging(leftInfluence) {
    if (leftInfluence) {
      this.game.players[this.index].leftInfluenceAlive = false;
    } else {
      this.game.players[this.index].rightInfluenceAlive = false;
    }
    if (this.game.phase === 15) {
      this.game.phase = 3;
    } else if (this.game.phase === 22) {
      this.game.phase = 30;
    } else if (this.game.phase === 25) {
      this.game.phase = 26;
    } else {
      this.game.phase = 1;
      this.game.actionPerformer = -1;
      this.game.actionRecipient = -1;
    }
    this.game.challenger = -1;
    this.webSocketService.emit('update-game', this.game);
  }

  mustLoseInfluenceForIncorrectlyChallenging() {
    return this.game.challenger === this.index && (this.game.phase === 11 || this.game.phase === 13 || this.game.phase === 15
    || this.game.phase === 17 || this.game.phase === 19 || this.game.phase === 22 || this.game.phase === 25 || this.game.phase === 28);
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
