import { Component } from '@angular/core';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

import { Router } from '@angular/router';

import { DataService } from '../services/data.service';

import { Listing } from '../interfaces/listing.interface';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public listings: Listing[];

  constructor(
    // private dataService: DataService,
    private router: Router
    ) {
      this.initialise();
     }

  async initialise() {
    console.log('Hello initialise');
  }

  // async viewListing(listing: Listing) {
  //   try {
  //     Storage.set({
  //       key: 'selectedListing',
  //       value: JSON.stringify(listing)
  //     });
  //     this.router.navigate(['/listing', listing.name]);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  viewMap() {
    this.router.navigate(['/map'])
    .catch(err => console.error(err));
  }

}
