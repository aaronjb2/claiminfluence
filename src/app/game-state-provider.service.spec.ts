import { TestBed } from '@angular/core/testing';

import { GameStateProviderService } from './game-state-provider.service';

describe('GameStateProviderService', () => {
  let service: GameStateProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameStateProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
