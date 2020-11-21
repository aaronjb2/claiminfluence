import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'avatars-group-three',
  templateUrl: './avatars-group-three.component.html',
  styleUrls: ['./avatars-group-three.component.scss']
})
export class AvatarsGroupThreeComponent implements OnInit {
  @Input() game: {players: {name: string}[], started: boolean, numberOfPlayers: number};
  @Input() updateName: VoidFunction;

  constructor() { }

  ngOnInit(): void {
  }

}
