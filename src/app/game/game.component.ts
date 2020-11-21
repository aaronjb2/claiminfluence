import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameStateProviderService } from '../game-state-provider.service';
import { WebSocketService } from '../web-socket.service';


@Component({
  selector: 'app-game',
  // templateUrl: './game.component.html',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
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
    this.game.numberOfPlayers = parseInt(numberOfPlayers.value);
    console.log('this.game: ', this.game)
    this.webSocketService.emit('update-game', this.game);
  }

  changeName(index, newName) {
    console.log('inside change name');
    console.log('index: ', index);
    console.log('newName: ', newName);
    console.log('this.game: ', this.game);
    this.game.players[index].name = newName;
    this.webSocketService.emit('update-game', this.game);
  }

}
