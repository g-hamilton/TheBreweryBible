import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingSearchFiltersPage } from './listing-search-filters.page';

describe('ListingSearchFiltersPage', () => {
  let component: ListingSearchFiltersPage;
  let fixture: ComponentFixture<ListingSearchFiltersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListingSearchFiltersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingSearchFiltersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
