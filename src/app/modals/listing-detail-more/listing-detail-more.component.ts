import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

import { Plugins, BrowserOpenOptions } from '@capacitor/core';
const { Browser } = Plugins;

import { Listing } from '../../interfaces/listing.interface';


@Component({
  selector: 'app-listing-detail-more',
  templateUrl: './listing-detail-more.component.html',
  styleUrls: ['./listing-detail-more.component.scss'],
})
export class ListingDetailMoreComponent implements OnInit {

  @Input() listing: Listing;

  constructor(private popoverCtrl: PopoverController) { }

  ngOnInit() {
    console.log('Input:', this.listing);
  }

  async openBrowser(url: string) {
    /*
    Note: Only HTTP and HTTPS URLs are supported
    */
    if (!url.includes('http://') || !url.includes('https://')) {
      url = 'http://' + url;
    }
    const options: BrowserOpenOptions = {
      url,
      toolbarColor: '#000000'
    };
    await Browser.open(options);
  }

  async close() {
    this.popoverCtrl.dismiss()
    .catch(err => console.error(err));
  }

}
