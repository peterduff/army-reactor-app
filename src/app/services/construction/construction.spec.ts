import { TestBed } from '@angular/core/testing';

import { Construction } from './construction';

describe('Construction', () => {
  let service: Construction;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Construction);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
