import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarsGroupFiveComponent } from './avatars-group-five.component';

describe('AvatarsGroupFiveComponent', () => {
  let component: AvatarsGroupFiveComponent;
  let fixture: ComponentFixture<AvatarsGroupFiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvatarsGroupFiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarsGroupFiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
