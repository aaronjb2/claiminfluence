import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarsGroupTwoComponent } from './avatars-group-two.component';

describe('AvatarsGroupTwoComponent', () => {
  let component: AvatarsGroupTwoComponent;
  let fixture: ComponentFixture<AvatarsGroupTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvatarsGroupTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarsGroupTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
