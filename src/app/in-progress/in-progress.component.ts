import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'in-progress',
  template: `<p>{{ identifier }}</p>`,
  styleUrls: ['./in-progress.component.scss']
})
export class InProgressComponent implements OnInit {
  @Input('identifier') identifier: string;

  constructor() {
   }

  ngOnInit(): void {
  }

}
