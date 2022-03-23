import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquareklesGameComponent } from './squarekles-game.component';

describe('SquareklesGameComponent', () => {
  let component: SquareklesGameComponent;
  let fixture: ComponentFixture<SquareklesGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SquareklesGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SquareklesGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
