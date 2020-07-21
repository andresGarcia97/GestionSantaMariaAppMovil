import { TestBed } from '@angular/core/testing';

import { HorariosLozaService } from './horarios-loza.service';

describe('HorariosLozaService', () => {
  let service: HorariosLozaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HorariosLozaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
