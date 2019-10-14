import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingFiltersPage } from './listing-filters-page';

describe('ListingFiltersPagePage', () => {
  let component: ListingFiltersPage;
  let fixture: ComponentFixture<ListingFiltersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListingFiltersPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingFiltersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
