import { Component, OnInit } from '@angular/core';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

import { Listing } from '../interfaces/listing.interface';

@Component({
  selector: 'app-listing-detail',
  templateUrl: './listing-detail.page.html',
  styleUrls: ['./listing-detail.page.scss'],
})
export class ListingDetailPage implements OnInit {

  public listing: Listing;

  public objKeys = Object.keys;

  constructor() { }

  ngOnInit() {
    this.fetchListing();
  }

  async fetchListing() {
    try {
      const res = await Storage.get({
        key: 'selectedListing'
      });
      const selectedListing = JSON.parse(res.value);
      // console.log(selectedListing);
      this.listing = selectedListing;
    } catch (err) {
      console.error(err);
    }
  }

}
