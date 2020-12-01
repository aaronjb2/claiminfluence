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
        this.game.players.push({name: `Player${currentNumberOfPlayers + i + 1}Name`})
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

}
