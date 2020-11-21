import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarsGroupThreeComponent } from './avatars-group-three.component';

describe('AvatarsGroupThreeComponent', () => {
  let component: AvatarsGroupThreeComponent;
  let fixture: ComponentFixture<AvatarsGroupThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvatarsGroupThreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarsGroupThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
