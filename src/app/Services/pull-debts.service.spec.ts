import { TestBed } from '@angular/core/testing';

import { PullDebtsService } from './pull-debts.service';

describe('PullDebtsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PullDebtsService = TestBed.get(PullDebtsService);
    expect(service).toBeTruthy();
  });
});
