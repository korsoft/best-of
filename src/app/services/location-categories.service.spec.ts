import { TestBed } from '@angular/core/testing';

import { LocationCategoriesService } from './location-categories.service';

describe('LocationCategoriesService', () => {
  let service: LocationCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
