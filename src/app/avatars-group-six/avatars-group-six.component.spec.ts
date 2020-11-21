import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarsGroupSixComponent } from './avatars-group-six.component';

describe('AvatarsGroupSixComponent', () => {
  let component: AvatarsGroupSixComponent;
  let fixture: ComponentFixture<AvatarsGroupSixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvatarsGroupSixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarsGroupSixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
