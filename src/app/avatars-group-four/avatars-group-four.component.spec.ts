import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarsGroupFourComponent } from './avatars-group-four.component';

describe('AvatarsGroupFourComponent', () => {
  let component: AvatarsGroupFourComponent;
  let fixture: ComponentFixture<AvatarsGroupFourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvatarsGroupFourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarsGroupFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
