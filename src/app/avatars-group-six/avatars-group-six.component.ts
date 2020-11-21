import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'avatars-group-six',
  templateUrl: './avatars-group-six.component.html',
  styleUrls: ['./avatars-group-six.component.scss']
})
export class AvatarsGroupSixComponent implements OnInit {
  @Input() game: {players: {name: string}[], started: boolean, numberOfPlayers: number};
  @Input() updateName: VoidFunction;

  constructor() { }

  ngOnInit(): void {
  }

}
