import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'avatars-group-five',
  templateUrl: './avatars-group-five.component.html',
  styleUrls: ['./avatars-group-five.component.scss']
})
export class AvatarsGroupFiveComponent implements OnInit {
  @Input() game: {players: {name: string}[], started: boolean, numberOfPlayers: number};
  @Input() updateName: VoidFunction;

  constructor() { }

  ngOnInit(): void {
  }

}
