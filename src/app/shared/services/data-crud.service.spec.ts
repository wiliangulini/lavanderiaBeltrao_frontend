import { TestBed } from '@angular/core/testing';

import { DataCrudService } from './data-crud.service';

describe('DataCrudService', () => {
  let service: DataCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
