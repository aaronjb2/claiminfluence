import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmSquarekleCardContainerComponent } from './confirm-squarekle-card-container.component';

describe('ConfirmSquarekleCardContainerComponent', () => {
  let component: ConfirmSquarekleCardContainerComponent;
  let fixture: ComponentFixture<ConfirmSquarekleCardContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmSquarekleCardContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmSquarekleCardContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
