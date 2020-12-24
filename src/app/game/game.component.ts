import { Component, OnInit, ViewChild, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AvatarComponent } from '../avatar/avatar.component';
import { GameStateProviderService } from '../game-state-provider.service';
import { WebSocketService } from '../web-socket.service';
const colorCodes = require('../../../resources/colorCodes.json');
const shapePaths = require('../../../resources/shapePaths.json');


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: [
    './game.component.scss',
    './player-positions.scss'
  ]
})
export class GameComponent implements OnInit {
  text: string;
  identifier: string;
  game;
  colorCode = 'white';
  shapePath = 'assets/images/square.jpg';
  selection = 'nonea';

  @ViewChild('avatar1') avatar1: AvatarComponent;
  @ViewChild('avatar2') avatar2: AvatarComponent;
  @ViewChild('avatar3') avatar3: AvatarComponent;
  @ViewChild('avatar4') avatar4: AvatarComponent;
  @ViewChild('avatar5') avatar5: AvatarComponent;
  @ViewChild('avatar6') avatar6: AvatarComponent;

  constructor(private route: ActivatedRoute,
    private webSocketService: WebSocketService,
    private gameStateProviderService: GameStateProviderService) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.identifier = params.get('identifier');
    });
    this.webSocketService.emit('join-identifier', this.identifier);
    this.gameStateProviderService.getState(this.identifier).subscribe((game) => {
      this.game = game;
      if (this.game && this.game.started && this.game.turn && this.game.turn !== -1) {
        this.colorCode = colorCodes[this.game.players[this.game.turn].color];
        this.shapePath = shapePaths[this.game.players[this.game.turn].shape];
      }
    });
    this.listen();
  }

  listen() {
    this.webSocketService.listen('update-game').subscribe(response => {
      let started = this.game.started;
      this.game = response;
      if (this.game.started && !started) {
        this.takeAvoidDisplayingAction();
      }
      if (this.game.started && this.game.turn && this.game.turn !== -1) {
        this.colorCode = colorCodes[this.game.players[this.game.turn].color];
        this.shapePath = shapePaths[this.game.players[this.game.turn].shape];
      }
    })
  }

  setNumberOfPlayers(numberOfPlayers) {
    const currentNumberOfPlayers = this.game.players.length;
    if (numberOfPlayers > currentNumberOfPlayers) {
      for (let i = 0; i < numberOfPlayers - currentNumberOfPlayers; i++) {
        this.game.players.push({
            name: `Player${currentNumberOfPlayers + i + 1}Name`,
            color: this.getNextAvailableColor(),
            shape: this.getNextAvailableShape(),
            leftInfluence: this.getNextAvailableInfluence(),
            rightInfluence: this.getNextAvailableInfluence(),
            leftInfluenceAlive: true,
            rightInfluenceAlive: true,
            coins: 2
          })
          this.game.players[this.game.players.length - 1].rightInfluence = this.getNextAvailableInfluence();
      }
    }
    if (numberOfPlayers < currentNumberOfPlayers) {
      this.game.players.splice(numberOfPlayers, currentNumberOfPlayers - numberOfPlayers);
    }
    this.webSocketService.emit('update-game', this.game);
  }

  changeName(index, newName) {
    this.game.players[index].name = newName;
    this.webSocketService.emit('update-game', this.game);
  }

  getPlayerClassName(index) {
    const playerIndexVal = index === 6 ? 'six'
      : index === 5 ? 'five'
      : index === 4 ? 'four'
      : index === 3 ? 'three'
      : index === 2 ? 'two'
      : 'one';
    const numberOfPlayersVal = this.game && this.game.players && this.game.players.length === 2 ? 'two'
      : this.game && this.game.players && this.game.players.length === 3 ? 'three'
      : this.game && this.game.players && this.game.players.length === 4 ? 'four'
      : this.game && this.game.players && this.game.players.length === 5 ? 'five'
      : 'six';
    return `${numberOfPlayersVal}-players-player-${playerIndexVal}`;
  }

  getNextAvailableShape() {
    let shape = -1;
    let found = false;
    while (!found) {
        shape = shape + 1;
        const shapeIndex = this.game.players.findIndex((player) => player.shape === shape);
        if (shapeIndex === -1) {
            found = true;
        }
    }
    return shape;
}

getNextAvailableColor() {
    let color = -1;
    let found = false;
    while (!found) {
        color = color + 1;
        const colorIndex = this.game.players.findIndex((player) => player.color === color);
        if (colorIndex === -1) {
            found = true;
        }
    }
    return color;
}

getNextAvailableInfluence() {
  let influence = -1;
    let found = false;
    while (!found) {
        influence = influence + 1;
        const influenceIndex = this.game.players.findIndex((player) => player.leftInfluence === influence || player.rightInfluence === influence);
        if (influenceIndex === -1) {
            found = true;
        }
    }
    return influence;
}

startGame() {
  const identityArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  this.game.turn = Math.floor(Math.random() * (this.game.players.length));
  for (let i = 0; i < this.game.players.length; i++) {
    let randomIndex = Math.floor(Math.random() * (identityArray.length));
    this.game.players[i].leftInfluence = identityArray[randomIndex];
    identityArray.splice(randomIndex, 1);
    randomIndex = Math.floor(Math.random() * (identityArray.length));
    this.game.players[i].rightInfluence = identityArray[randomIndex];
    this.game.players[i].leftInfluenceAlive = true;
    this.game.players[i].rightInfluenceAlive = true;
    this.game.players[i].coins = this.game.players.length === 2 && this.game.turn === i ? 1 : 2;
  }
  this.game.challenger = -1;
  this.game.blocker = -1;
  this.game.actionRecipient = -1;
  this.game.actionPerformer = -1;
  this.game.onlyOneCoin = false;
  this.game.phase = 1;
  this.game.extraInfluence1 = -1;
  this.game.extraInfluence2 = -1;
  this.game.started = true;
  this.takeAvoidDisplayingAction();
  this.webSocketService.emit('update-game', this.game);
  this.colorCode = colorCodes[this.game.players[this.game.turn].color];
  this.shapePath = shapePaths[this.game.players[this.game.turn].shape];
}

endGame() {
  this.game.started = false;
  this.webSocketService.emit('update-game', this.game);
}

takeAvoidDisplayingAction() {
  this.avatar1.stopDisplayingInfluences();
  this.avatar2.stopDisplayingInfluences();
  if (this.game.players.length > 2) {
    this.avatar3.stopDisplayingInfluences();
  }
  if (this.game.players.length > 3) {
    this.avatar4.stopDisplayingInfluences();
  }
  if (this.game.players.length > 4) {
    this.avatar5.stopDisplayingInfluences();
  }
  if (this.game.players.length > 5) {
    this.avatar6.stopDisplayingInfluences();
  }
}

setSelection(val) {
    this.selection = val;
}

getColorCode(index) {
  return colorCodes[this.game.players[index].color];
}

}
