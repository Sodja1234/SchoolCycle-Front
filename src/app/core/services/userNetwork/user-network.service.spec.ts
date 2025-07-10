import { TestBed } from '@angular/core/testing';

import { UserNetworkService } from './user-network.service';

describe('UserNetworkService', () => {
  let service: UserNetworkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserNetworkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
