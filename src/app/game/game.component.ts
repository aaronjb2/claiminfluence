import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameStateProviderService } from '../game-state-provider.service';
import { WebSocketService } from '../web-socket.service';


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
    });
    this.listen();
  }

  listen() {
    this.webSocketService.listen('update-game').subscribe(response => {
      this.game = response;
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

}
