import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquarklesBonusComponent } from './squarkles-bonus.component';

describe('SquarklesBonusComponent', () => {
  let component: SquarklesBonusComponent;
  let fixture: ComponentFixture<SquarklesBonusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SquarklesBonusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SquarklesBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
