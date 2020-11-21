import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'avatars-group-four',
  templateUrl: './avatars-group-four.component.html',
  styleUrls: ['./avatars-group-four.component.scss']
})
export class AvatarsGroupFourComponent implements OnInit {
  @Input() game: {players: {name: string}[], started: boolean, numberOfPlayers: number};
  @Input() updateName: VoidFunction;

  constructor() { }

  ngOnInit(): void {
  }

}
