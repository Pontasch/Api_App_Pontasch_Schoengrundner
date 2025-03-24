import { TestBed } from '@angular/core/testing';

import { FahrzeugeService } from './fahrzeuge.service';

describe('FahrzeugeService', () => {
  let service: FahrzeugeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FahrzeugeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
