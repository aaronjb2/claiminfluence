import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfluenceGameComponent } from './influence-game.component';

describe('GameComponent', () => {
  let component: InfluenceGameComponent;
  let fixture: ComponentFixture<InfluenceGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfluenceGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfluenceGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
