import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {
  @Input() name: string;
  @Input() updateName: VoidFunction;
  @Input() index: number;
  changingName: boolean = false;
  updatedName: string;

  constructor() { }

  ngOnInit(): void {
  }

  toggleChangingName = () => {
    this.changingName = !this.changingName;
  }
}
