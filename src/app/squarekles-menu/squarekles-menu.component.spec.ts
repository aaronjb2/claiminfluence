import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquareklesMenuComponent } from './squarekles-menu.component';

describe('SquareklesMenuComponent', () => {
  let component: SquareklesMenuComponent;
  let fixture: ComponentFixture<SquareklesMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SquareklesMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SquareklesMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
