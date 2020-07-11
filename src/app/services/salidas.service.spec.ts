import { TestBed } from '@angular/core/testing';

import { SalidasService } from './salidas.service';

describe('SalidasService', () => {
  let service: SalidasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalidasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
