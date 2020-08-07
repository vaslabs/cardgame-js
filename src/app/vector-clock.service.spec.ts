import { TestBed } from '@angular/core/testing';

import { VectorClockService } from './vector-clock.service';

describe('VectorClockService', () => {
  let service: VectorClockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VectorClockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should tick own clock properly', () => {
    expect(service.tick("me")).toBe({"me": 0})
  });
});
