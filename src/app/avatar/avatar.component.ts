import { Component, Input, OnInit } from '@angular/core';
import { WebSocketService } from '../web-socket.service';

@Component({
  selector: 'avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {
  @Input() index: number;
  @Input() game;
  changingName: boolean = false;

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {
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
}
