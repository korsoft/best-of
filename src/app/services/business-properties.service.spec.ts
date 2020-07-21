import { TestBed } from '@angular/core/testing';

import { BusinessPropertiesService } from './business-properties.service';

describe('BusinessPropieriesService', () => {
  let service: BusinessPropertiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessPropertiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
