import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinExchangeCarrierComponent } from './coin-exchange-carrier.component';

describe('CoinExchangeCarrierComponent', () => {
  let component: CoinExchangeCarrierComponent;
  let fixture: ComponentFixture<CoinExchangeCarrierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoinExchangeCarrierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinExchangeCarrierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
