import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquarklesAvatarComponent } from './squarkles-avatar.component';

describe('SquarklesAvatarComponent', () => {
  let component: SquarklesAvatarComponent;
  let fixture: ComponentFixture<SquarklesAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SquarklesAvatarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SquarklesAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
