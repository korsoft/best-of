import { TestBed } from '@angular/core/testing';

import { DevicePushService } from './device-push.service';

describe('DevicePushService', () => {
  let service: DevicePushService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevicePushService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
