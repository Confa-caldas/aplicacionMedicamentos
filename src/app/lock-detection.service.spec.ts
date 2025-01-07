import { TestBed } from '@angular/core/testing';

import { LockDetectionService } from './lock-detection.service';

describe('LockDetectionService', () => {
  let service: LockDetectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LockDetectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
