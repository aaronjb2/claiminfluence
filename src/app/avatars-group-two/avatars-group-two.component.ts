import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'avatars-group-two',
  templateUrl: './avatars-group-two.component.html',
  styleUrls: ['./avatars-group-two.component.scss']
})
export class AvatarsGroupTwoComponent implements OnInit {
  @Input() game: {players: {name: string}[], started: boolean, numberOfPlayers: number};
  @Input() updateName: VoidFunction;

  constructor() { }

  ngOnInit(): void {
  }

}
