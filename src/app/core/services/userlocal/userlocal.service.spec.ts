import { TestBed } from '@angular/core/testing';

import { UserlocalService } from './userlocal.service';

describe('UserlocalService', () => {
  let service: UserlocalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserlocalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
