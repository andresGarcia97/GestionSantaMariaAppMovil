import { TestBed } from '@angular/core/testing';

import { InasistenciaService } from './inasistencia.service';

describe('InasistenciaService', () => {
  let service: InasistenciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InasistenciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
