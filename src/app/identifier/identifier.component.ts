import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-identifier',
  templateUrl: './identifier.component.html',
  styleUrls: ['./identifier.component.scss']
})
export class IdentifierComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  redirectToInfluence(identifier) {
    this.router.navigate(['influence/' + identifier.value]);
  }

}
