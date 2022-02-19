import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfluenceAvatarComponent } from './influence-avatar.component';

describe('AvatarComponent', () => {
  let component: InfluenceAvatarComponent;
  let fixture: ComponentFixture<InfluenceAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfluenceAvatarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfluenceAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
