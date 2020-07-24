import { TestBed } from '@angular/core/testing';

import { UsuarioGuard } from './usuario-guard.guard';

describe('UsuarioGuardGuard', () => {
  let guard: UsuarioGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UsuarioGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
