import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquareklesDeckComponent } from './squarekles-deck.component';

describe('SquareklesDeckComponent', () => {
  let component: SquareklesDeckComponent;
  let fixture: ComponentFixture<SquareklesDeckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SquareklesDeckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SquareklesDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
