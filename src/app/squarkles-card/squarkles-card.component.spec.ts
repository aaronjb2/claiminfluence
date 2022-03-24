import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquarklesCardComponent } from './squarkles-card.component';

describe('SquarklesCardComponent', () => {
  let component: SquarklesCardComponent;
  let fixture: ComponentFixture<SquarklesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SquarklesCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SquarklesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
