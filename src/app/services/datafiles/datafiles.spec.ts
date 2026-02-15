import { TestBed } from '@angular/core/testing';

import { Datafiles } from './datafiles';

describe('Datafiles', () => {
  let service: Datafiles;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Datafiles);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
