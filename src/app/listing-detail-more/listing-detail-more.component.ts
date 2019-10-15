import { Component, OnInit, Input } from '@angular/core';

import { AlgoliaListing } from '../interfaces/algolia.listing.interface';

@Component({
  selector: 'app-listing-detail-more',
  templateUrl: './listing-detail-more.component.html',
  styleUrls: ['./listing-detail-more.component.scss'],
})
export class ListingDetailMoreComponent implements OnInit {

  @Input() listing: AlgoliaListing;

  constructor() { }

  ngOnInit() {
    console.log('Input:', this.listing);
  }

}
