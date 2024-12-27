import { TestBed } from '@angular/core/testing';
import { BlindTestService } from './blind-test.service';


describe('BlindTestService', () => {
  let service: BlindTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlindTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
